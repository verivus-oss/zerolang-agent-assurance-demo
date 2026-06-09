# Zerolang Agent Assurance Demo

This repo demonstrates DAG-TOML as a governance sidecar over Zerolang graph evidence.

The short version:

- Zerolang proves the graph artifact: validity, graph hash, typecheck, target readiness, safety facts, and compiler evidence.
- DAG-TOML proves the process around that artifact: provenance, closure root, evidence records, review gates, traceability, and validation output.
- The CIS profile pack shows how a sidecar can add adherence checks without becoming a runtime, permission system, or replacement for Zero.

## What Is Included

- `fixtures/hello.graph`: a small checked Zero graph artifact.
- `scripts/zero-dagtoml-demo.mts`: emits a base DAG-TOML sidecar from `zero check --json` and `zero inspect --json`.
- `scripts/share-dagtoml-demo.mts`: creates a shareable evidence bundle and validates it with the agent-assurance validators.
- `profile-packs/CIS_SOFTWARE_SERVICES.toml`: a CIS Controls v8.1 software/services profile pack.
- `profile-packs/CIS_SOFTWARE_SERVICES.md` and `profile-packs/CIS_SOFTWARE_SERVICES_SUPPLEMENT.md`: profile-pack companion docs.
- `artifacts/reference`: a checked reference run with sidecars, captured Zero evidence, profile-pack copy, and validator output.

## Prerequisites

- Node.js 24 or newer.
- `pnpm`.
- A Zerolang checkout or installed `zero` binary.
- The agent-assurance validator repo checked out next to this repo, or passed with `AGENT_ASSURANCE_ROOT`.

The default local layout used by this demo is:

```text
verivus-oss/
  agent-assurance/
  zerolang-agent-assurance-demo/
```

If your layout differs, set:

```sh
export ZERO_BIN=zero
export AGENT_ASSURANCE_ROOT=../agent-assurance
```

## Run The Demo

From this repo:

```sh
ZERO_BIN=zero pnpm run dagtoml:share -- fixtures/hello.graph --out-dir artifacts/share/hello
```

Or, on the local workstation where this was prepared:

```sh
pnpm run demo:dry-run
```

The share bundle contains:

- `artifacts/share/hello/fixtures-hello.dag.toml`
- `artifacts/share/hello/zero-check.json`
- `artifacts/share/hello/zero-inspect.json`
- `artifacts/share/hello/validation.txt`
- `artifacts/share/hello/README.md`
- `artifacts/share/hello/profile-packs/CIS_SOFTWARE_SERVICES.toml`
- `artifacts/share/hello/profile-packs/CIS_SOFTWARE_SERVICES.md`
- `artifacts/share/hello/profile-packs/CIS_SOFTWARE_SERVICES_SUPPLEMENT.md`

A pre-generated reference bundle is checked in at:

```text
artifacts/reference/share/
```

## LLM Runbook

Give this file to an LLM to have it read the repo and walk the Zerolang team through the demo step by step:

```text
instructions/zerolang-team-demo.runbook.dag.toml
```

The completed deterministic state is checked in at:

```text
instructions/zerolang-team-demo.completed.dag.toml
```

Completion is not based on the LLM's summary. It is validated with:

```sh
pnpm run demo:validate-completion
```

That command checks required files, expected hashes, validator transcript markers, profile-pack evidence, and that all eight completed DAG units have `status = "done"`.

## What To Show

1. Zero validates the graph:

```sh
$ZERO_BIN check --json fixtures/hello.graph
```

2. Zero exposes graph/readiness evidence:

```sh
$ZERO_BIN inspect --json fixtures/hello.graph
```

3. The sidecar anchors the Zero evidence:

```sh
sed -n '1,180p' artifacts/share/hello/fixtures-hello.dag.toml
```

4. The validators verify the sidecar:

```sh
cat artifacts/share/hello/validation.txt
```

5. The CIS profile extension is carried as evidence:

```sh
rg -n "profile_packs|CIS|sample_contracts|source_sha256" artifacts/share/hello/fixtures-hello.dag.toml
```

## Positioning

This is intentionally a sidecar:

- It does not alter Zero runtime semantics.
- It does not add a permission layer.
- It does not replace Zero's graph validity or typechecking.

The value is composition: every checked Zero graph hash is an ideal closure root for a governed evidence bundle.
