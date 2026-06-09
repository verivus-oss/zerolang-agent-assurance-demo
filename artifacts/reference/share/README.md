# Zero + DAG-TOML Demo Bundle

This bundle demonstrates DAG-TOML as a governance sidecar over a Zero graph.
Zero proves the graph; DAG-TOML records the review/evidence process around that proof.

## Demo Command

```sh
ZERO_BIN=zero pnpm run dagtoml:share -- fixtures/hello.graph --out-dir artifacts/reference/share
```

## What To Show

1. Zero validates the graph:

```sh
zero check --json fixtures/hello.graph
```

2. Zero exposes graph and readiness evidence:

```sh
zero inspect --json fixtures/hello.graph
```

3. The sidecar anchors that evidence as DAG-TOML:

```sh
sed -n '1,180p' artifacts/reference/share/fixtures-hello.dag.toml
```

4. The agent-assurance validators verify the sidecar:

```sh
cat artifacts/reference/share/validation.txt
```

## CIS Adherence Profile Pack

This bundle includes a DAG-TOML profile pack that maps CIS Controls v8.1 software and service safeguards into machine-readable contract declarations.
The Zero graph remains the artifact proof. The profile pack is an extension layer for governance checks such as required evidence names, adapter validators, and adherence gate criteria.

- Profile: `Comprehensive Policy Pack: CIS Controls v8.1 (Software & Services)`
- Contracts: `16`
- SHA-256: `sha256:161b4eaa448234ac0125c8d2cf8e35c090fd508408df51b329f256a35cdf5136`
- Bundle path: `artifacts/reference/share/profile-packs/CIS_SOFTWARE_SERVICES.toml`
- Sample contracts: `CIS-16-1`, `CIS-16-2`, `CIS-16-3`, `CIS-16-4`, `CIS-16-5`, `CIS-16-6`, `CIS-16-7`, `CIS-16-8`

Show the extension metadata:

```sh
rg -n "profile_packs|CIS|sample_contracts|source_sha256" artifacts/reference/share/fixtures-hello.dag.toml
```


## Key Anchors

- Zero module: `module:hello`
- Zero graph hash: `graph:548e0af7897e1d09`
- Target: `linux-x64`
- Backend: `zero-elf64-exe`
- Buildable: `true`
- Sidecar validation: `passed`

## Sidecar Extract

```toml
closure_root = "sha256:598b116bf106fcda921befd1b4ddfbfa816e1c4bf19f0299e00def28a1eae281"
source_sha256      = "sha256:5a8f3689bd05921106a8668c76c44dc8dfb628ddc652c45a6016de9e8946e331"
graph_hash        = "graph:548e0af7897e1d09"
target            = "linux-x64"
buildable         = true
checked           = true
```

## Files

- `artifacts/reference/share/fixtures-hello.dag.toml`: DAG-TOML implementation-dag sidecar
- `artifacts/reference/share/zero-check.json`: captured Zero check evidence
- `artifacts/reference/share/zero-inspect.json`: captured Zero inspect evidence
- `artifacts/reference/share/validation.txt`: DAG-TOML validator output
- `artifacts/reference/share/profile-packs/CIS_SOFTWARE_SERVICES.toml`: CIS software/services profile pack
- `artifacts/reference/share/profile-packs/CIS_SOFTWARE_SERVICES.md`: CIS profile companion documentation
- `artifacts/reference/share/profile-packs/CIS_SOFTWARE_SERVICES_SUPPLEMENT.md`: CIS profile companion documentation


## Talk Track

Zero proves the artifact: graph validity, typecheck, target readiness, safety facts, and hash identity.
DAG-TOML proves the claim around that artifact: provenance, evidence, review gates, traceability, and stale-evidence detection.
The CIS profile pack shows how that same sidecar can add adherence tests without becoming a runtime permission layer.
