#!/usr/bin/env -S node --experimental-strip-types --disable-warning=ExperimentalWarning
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const defaultAssuranceRoot = resolve(root, "../agent-assurance");
const defaultProfilePack = resolve(root, "profile-packs/CIS_SOFTWARE_SERVICES.toml");

type ProfilePack = {
  id: string;
  title: string;
  sourcePath: string;
  bundlePath: string;
  sha256: string;
  bytes: number;
  contractCount: number;
  contractIds: string[];
  companionBundlePaths: string[];
};

function usage() {
  console.log(`Create a shareable Zero + DAG-TOML demo bundle.

Usage:
  pnpm run dagtoml:share -- [zero-input] [--out-dir <dir>] [--target <target>] [--zero <path>] [--assurance-root <path>] [--profile-pack <path>] [--no-profile-pack]

Example:
  ZERO_BIN=zero pnpm run dagtoml:share -- fixtures/hello.graph --out-dir artifacts/share/hello

Environment:
  ZERO_BIN overrides the Zero compiler path when --zero is omitted.
  AGENT_ASSURANCE_ROOT overrides the validator repo path.
  DAGTOML_PROFILE_PACK overrides the bundled CIS profile pack path.
`);
}

function argValue(args: string[], name: string) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positionalInput(args: string[]) {
  return args.find((arg, index) => {
    if (arg.startsWith("--")) return false;
    const previous = args[index - 1];
    return (
      previous !== "--out-dir" &&
      previous !== "--target" &&
      previous !== "--zero" &&
      previous !== "--assurance-root" &&
      previous !== "--profile-pack"
    );
  });
}

function run(command: string, args: string[], cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return {
    command: [command, ...args].join(" "),
    code: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    ok: result.status === 0,
  };
}

function mustRun(command: string, args: string[], cwd = root) {
  const result = run(command, args, cwd);
  if (!result.ok) {
    throw new Error(`${result.command} failed\n${result.stdout}${result.stderr}`);
  }
  return result;
}

function readJson(command: string, args: string[]) {
  const stdout = execFileSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(stdout);
}

function rel(path: string) {
  return relative(root, resolve(root, path)).replaceAll("\\", "/");
}

function tomlString(value: unknown) {
  return JSON.stringify(String(value ?? ""));
}

function tomlArray(values: unknown[]) {
  return `[${values.map(tomlString).join(", ")}]`;
}

function shell(command: string) {
  return command.replace(root, ".");
}

function displayCommand(command: string) {
  if (resolve(command) === command) return basename(command);
  return command;
}

function sanitizeTranscript(text: string, assuranceRoot: string) {
  return text
    .replaceAll(root, ".")
    .replaceAll(assuranceRoot, "$AGENT_ASSURANCE_ROOT");
}

function sha256Bytes(bytes: Buffer) {
  return createHash("sha256").update(bytes).digest("hex");
}

function profileIdFromPath(path: string) {
  return basename(path, ".toml")
    .replace(/[^A-Za-z0-9_.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function profileCompanionPaths(profilePath: string) {
  const stem = profilePath.replace(/\.toml$/i, "");
  return [`${stem}.md`, `${stem}_SUPPLEMENT.md`].filter(existsSync);
}

function parseProfileSummary(text: string, fallbackId: string) {
  const title = text.match(/^\s*title\s*=\s*"([^"]+)"/m)?.[1] ?? fallbackId;
  const contractIds = Array.from(text.matchAll(/^\s*id\s*=\s*"([^"]+)"/gm), (match) => match[1]);
  return {
    title,
    contractCount: (text.match(/^\s*\[\[contracts\]\]\s*$/gm) ?? []).length,
    contractIds,
  };
}

function copyProfilePack(sourcePath: string, outDir: string): ProfilePack {
  if (!existsSync(sourcePath)) {
    throw new Error(`profile pack not found: ${sourcePath}`);
  }

  const profileDir = `${outDir}/profile-packs`;
  mkdirSync(resolve(root, profileDir), { recursive: true });

  const bundlePath = `${profileDir}/${basename(sourcePath)}`;
  copyFileSync(sourcePath, resolve(root, bundlePath));

  const bytes = readFileSync(sourcePath);
  const id = profileIdFromPath(sourcePath);
  const { title, contractCount, contractIds } = parseProfileSummary(bytes.toString("utf8"), id);
  const companionBundlePaths = profileCompanionPaths(sourcePath).map((companionPath) => {
    const companionBundlePath = `${profileDir}/${basename(companionPath)}`;
    copyFileSync(companionPath, resolve(root, companionBundlePath));
    return companionBundlePath;
  });

  return {
    id,
    title,
    sourcePath: rel(sourcePath),
    bundlePath,
    sha256: sha256Bytes(bytes),
    bytes: bytes.length,
    contractCount,
    contractIds,
    companionBundlePaths,
  };
}

function appendProfilePackExtension(sidecarPath: string, profile: ProfilePack) {
  const selectedContracts = profile.contractIds.slice(0, 8);
  const extension = `
# Profile-pack extension: DAG-TOML can carry governance/adherence profiles
# alongside Zero's checked graph evidence without changing Zero runtime semantics.
[[profile_packs]]
id             = ${tomlString(profile.id)}
title          = ${tomlString(profile.title)}
framework      = "CIS Controls v8.1"
kind           = "contract-declaration"
source_path    = ${tomlString(profile.sourcePath)}
bundle_path    = ${tomlString(profile.bundlePath)}
source_sha256  = ${tomlString(`sha256:${profile.sha256}`)}
source_bytes   = ${profile.bytes}
contract_count = ${profile.contractCount}
sample_contracts = ${tomlArray(selectedContracts)}
purpose        = "Demonstrate a DAG-TOML profile pack for testing CIS software and service adherence over a Zero graph closure root."

[[profile_packs.evidence]]
id      = "EV:cis-software-services-profile-pack"
kind    = "policy-profile"
path    = ${tomlString(profile.bundlePath)}
ok      = true
anchors = ["ART:zero-graph-closure-root", "OUT:dag-toml-governance-sidecar"]
`;

  writeFileSync(resolve(root, sidecarPath), `${readFileSync(resolve(root, sidecarPath), "utf8")}${extension}`);
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}

const input = positionalInput(args) ?? "fixtures/hello.graph";
const target = argValue(args, "--target");
const zero = argValue(args, "--zero") ?? process.env.ZERO_BIN ?? "zero";
const assuranceRoot = resolve(
  argValue(args, "--assurance-root") ?? process.env.AGENT_ASSURANCE_ROOT ?? defaultAssuranceRoot,
);
const profilePackSource = args.includes("--no-profile-pack")
  ? undefined
  : resolve(argValue(args, "--profile-pack") ?? process.env.DAGTOML_PROFILE_PACK ?? defaultProfilePack);
const safeName = input.replace(/[^A-Za-z0-9_.-]+/g, "-").replace(/^-+|-+$/g, "") || "zero-demo";
const outDir = argValue(args, "--out-dir") ?? `artifacts/share/${safeName}`;
const sidecarPath = `${outDir}/${basename(safeName, ".graph")}.dag.toml`;
const checkPath = `${outDir}/zero-check.json`;
const inspectPath = `${outDir}/zero-inspect.json`;
const validationPath = `${outDir}/validation.txt`;
const summaryPath = `${outDir}/README.md`;

mkdirSync(resolve(root, outDir), { recursive: true });

const targetArgs = target ? ["--target", target] : [];
const displayZero = displayCommand(zero);
const check = readJson(zero, ["check", "--json", ...targetArgs, input]);
const inspect = readJson(zero, ["inspect", "--json", ...targetArgs, input]);
writeFileSync(resolve(root, checkPath), `${JSON.stringify(check, null, 2)}\n`);
writeFileSync(resolve(root, inspectPath), `${JSON.stringify(inspect, null, 2)}\n`);

mustRun(process.execPath, [
  "--experimental-strip-types",
  "--disable-warning=ExperimentalWarning",
  "scripts/zero-dagtoml-demo.mts",
  input,
  "--out",
  sidecarPath,
  "--zero",
  zero,
  ...(target ? ["--target", target] : []),
]);

const profilePack = profilePackSource ? copyProfilePack(profilePackSource, outDir) : undefined;
if (profilePack) {
  appendProfilePackExtension(sidecarPath, profilePack);
}

const validationCommands = [
  {
    label: "closure-root",
    command: "python3",
    args: [`${assuranceRoot}/validators/validate_closure_root.py`, resolve(root, sidecarPath), "--repo-root", assuranceRoot],
    cwd: assuranceRoot,
  },
  {
    label: "provenance",
    command: "python3",
    args: [`${assuranceRoot}/validators/validate_provenance.py`, rel(sidecarPath), "--repo-root", "."],
    cwd: root,
  },
  {
    label: "implementation-dag",
    command: "python3",
    args: [`${assuranceRoot}/validators/validate_implementation_dag.py`, resolve(root, sidecarPath), "--repo-root", root, "--check-paths-exist"],
    cwd: assuranceRoot,
  },
];

const validationResults = validationCommands.map((item) => ({ ...item, result: run(item.command, item.args, item.cwd) }));
const validationText = validationResults
  .map(({ label, result }) => {
    const body = sanitizeTranscript(`${result.stdout}${result.stderr}`.trim(), assuranceRoot);
    return `## ${label}\n$ ${sanitizeTranscript(shell(result.command), assuranceRoot)}\nexit ${result.code}\n${body}\n`;
  })
  .join("\n");
writeFileSync(resolve(root, validationPath), validationText);

const graph = inspect.graph ?? check;
const targetReadiness = inspect.targetReadiness ?? check.targetReadiness ?? {};
const zeroSection = readFileSync(resolve(root, sidecarPath), "utf8")
  .split("# Profile-pack extension")[0]
  .split("\n")
  .filter((line) =>
    line.startsWith("closure_root") ||
    line.startsWith("source_sha256") ||
    line.startsWith("graph_hash") ||
    line.startsWith("target") ||
    line.startsWith("buildable") ||
    line.startsWith("checked"),
  )
  .slice(0, 10)
  .join("\n");

const allValid = validationResults.every(({ result }) => result.ok);
const profileSection = profilePack
  ? `
## CIS Adherence Profile Pack

This bundle includes a DAG-TOML profile pack that maps CIS Controls v8.1 software and service safeguards into machine-readable contract declarations.
The Zero graph remains the artifact proof. The profile pack is an extension layer for governance checks such as required evidence names, adapter validators, and adherence gate criteria.

- Profile: \`${profilePack.title}\`
- Contracts: \`${profilePack.contractCount}\`
- SHA-256: \`sha256:${profilePack.sha256}\`
- Bundle path: \`${profilePack.bundlePath}\`
- Sample contracts: \`${profilePack.contractIds.slice(0, 8).join("`, `")}\`

Show the extension metadata:

\`\`\`sh
rg -n "profile_packs|CIS|sample_contracts|source_sha256" ${sidecarPath}
\`\`\`
`
  : `
## Profile Pack

No profile pack was included. Re-run without \`--no-profile-pack\`, or pass \`--profile-pack <path>\`, to include a governance/adherence profile extension.
`;
const profileFiles = profilePack
  ? [
      `- \`${profilePack.bundlePath}\`: CIS software/services profile pack`,
      ...profilePack.companionBundlePaths.map((path) => `- \`${path}\`: CIS profile companion documentation`),
    ].join("\n")
  : "";
const summary = `# Zero + DAG-TOML Demo Bundle

This bundle demonstrates DAG-TOML as a governance sidecar over a Zero graph.
Zero proves the graph; DAG-TOML records the review/evidence process around that proof.

## Demo Command

\`\`\`sh
ZERO_BIN=${displayZero} pnpm run dagtoml:share -- ${input}${target ? ` --target ${target}` : ""} --out-dir ${outDir}
\`\`\`

## What To Show

1. Zero validates the graph:

\`\`\`sh
${displayZero} check --json ${target ? `--target ${target} ` : ""}${input}
\`\`\`

2. Zero exposes graph and readiness evidence:

\`\`\`sh
${displayZero} inspect --json ${target ? `--target ${target} ` : ""}${input}
\`\`\`

3. The sidecar anchors that evidence as DAG-TOML:

\`\`\`sh
sed -n '1,180p' ${sidecarPath}
\`\`\`

4. The agent-assurance validators verify the sidecar:

\`\`\`sh
cat ${validationPath}
\`\`\`
${profileSection}

## Key Anchors

- Zero module: \`${graph.moduleIdentity ?? ""}\`
- Zero graph hash: \`${graph.graphHash ?? check.graphHash ?? ""}\`
- Target: \`${targetReadiness.target ?? inspect.targetSupport?.target ?? target ?? "host"}\`
- Backend: \`${targetReadiness.backend ?? ""}\`
- Buildable: \`${targetReadiness.buildable !== false}\`
- Sidecar validation: \`${allValid ? "passed" : "failed"}\`

## Sidecar Extract

\`\`\`toml
${zeroSection}
\`\`\`

## Files

- \`${sidecarPath}\`: DAG-TOML implementation-dag sidecar
- \`${checkPath}\`: captured Zero check evidence
- \`${inspectPath}\`: captured Zero inspect evidence
- \`${validationPath}\`: DAG-TOML validator output
${profileFiles ? `${profileFiles}\n` : ""}

## Talk Track

Zero proves the artifact: graph validity, typecheck, target readiness, safety facts, and hash identity.
DAG-TOML proves the claim around that artifact: provenance, evidence, review gates, traceability, and stale-evidence detection.
The CIS profile pack shows how that same sidecar can add adherence tests without becoming a runtime permission layer.
`;

writeFileSync(resolve(root, summaryPath), summary);

console.log(`bundle ${outDir}`);
console.log(`sidecar ${sidecarPath}`);
console.log(`summary ${summaryPath}`);
if (profilePack) console.log(`profile_pack ${profilePack.bundlePath}`);
console.log(`validation ${allValid ? "passed" : "failed"}`);
if (!allValid) process.exit(1);
