#!/usr/bin/env -S node --experimental-strip-types --disable-warning=ExperimentalWarning
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const expected = {
  graphSha256: "5a8f3689bd05921106a8668c76c44dc8dfb628ddc652c45a6016de9e8946e331",
  closureRoot: "sha256:598b116bf106fcda921befd1b4ddfbfa816e1c4bf19f0299e00def28a1eae281",
  profileSha256: "161b4eaa448234ac0125c8d2cf8e35c090fd508408df51b329f256a35cdf5136",
  contractCount: 16,
  unitCount: 8,
};

function usage() {
  console.log(`Validate deterministic completion of the Zerolang agent-assurance demo.

Usage:
  pnpm run demo:validate-completion
  pnpm run demo:validate-completion -- --bundle artifacts/demo-run/share --dag instructions/zerolang-team-demo.completed.dag.toml
`);
}

function argValue(args: string[], name: string) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function sha256(path: string) {
  return createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex");
}

function requireFile(path: string) {
  if (!existsSync(resolve(root, path))) throw new Error(`missing required file: ${path}`);
}

function requireIncludes(path: string, text: string) {
  const body = readFileSync(resolve(root, path), "utf8");
  if (!body.includes(text)) throw new Error(`${path} does not include expected text: ${text}`);
  return body;
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}

const bundle = argValue(args, "--bundle") ?? "artifacts/reference/share";
const dagPath = argValue(args, "--dag") ?? "instructions/zerolang-team-demo.completed.dag.toml";
const sidecar = `${bundle}/fixtures-hello.dag.toml`;
const validation = `${bundle}/validation.txt`;

for (const path of [
  "fixtures/hello.graph",
  "profile-packs/CIS_SOFTWARE_SERVICES.toml",
  dagPath,
  sidecar,
  validation,
  `${bundle}/README.md`,
  `${bundle}/zero-check.json`,
  `${bundle}/zero-inspect.json`,
  `${bundle}/profile-packs/CIS_SOFTWARE_SERVICES.toml`,
  `${bundle}/profile-packs/CIS_SOFTWARE_SERVICES.md`,
  `${bundle}/profile-packs/CIS_SOFTWARE_SERVICES_SUPPLEMENT.md`,
]) {
  requireFile(path);
}

if (sha256("fixtures/hello.graph") !== expected.graphSha256) {
  throw new Error("fixtures/hello.graph SHA-256 does not match the expected demo graph hash");
}
if (sha256("profile-packs/CIS_SOFTWARE_SERVICES.toml") !== expected.profileSha256) {
  throw new Error("bundled CIS profile pack SHA-256 does not match expected hash");
}

const sidecarText = requireIncludes(sidecar, `closure_root = "${expected.closureRoot}"`);
requireIncludes(sidecar, `source_sha256  = "sha256:${expected.profileSha256}"`);
requireIncludes(sidecar, `contract_count = ${expected.contractCount}`);

const validationText = readFileSync(resolve(root, validation), "utf8");
for (const marker of [
  "## closure-root\n",
  "## provenance\n",
  "## implementation-dag\n",
  "exit 0",
  "CLOSURE-ROOT VALIDATION PASSED",
  "PROVENANCE VALIDATION PASSED",
  "IMPLEMENTATION DAG VALIDATION PASSED",
]) {
  if (!validationText.includes(marker)) throw new Error(`${validation} missing marker: ${marker.trim()}`);
}

const dag = readFileSync(resolve(root, dagPath), "utf8");
const statusMatches = Array.from(dag.matchAll(/^\s*status\s*=\s*"([^"]+)"/gm), (match) => match[1]);
if (statusMatches.length !== expected.unitCount) {
  throw new Error(`${dagPath} has ${statusMatches.length} status fields; expected ${expected.unitCount}`);
}
if (!statusMatches.every((status) => status === "done")) {
  throw new Error(`${dagPath} is not complete; all ${expected.unitCount} units must have status = "done"`);
}
for (const marker of [
  'deterministic_result = "passed"',
  'completed = true',
  `expected_closure_root = "${expected.closureRoot}"`,
  `expected_profile_sha256 = "sha256:${expected.profileSha256}"`,
]) {
  if (!dag.includes(marker)) throw new Error(`${dagPath} missing completion marker: ${marker}`);
}
if (!sidecarText.includes("[[profile_packs.evidence]]")) {
  throw new Error(`${sidecar} missing profile-pack evidence extension`);
}

console.log("DEMO COMPLETION VALIDATION PASSED");
console.log(`bundle ${bundle}`);
console.log(`dag ${dagPath}`);
console.log(`closure_root ${expected.closureRoot}`);
console.log(`profile_sha256 sha256:${expected.profileSha256}`);
