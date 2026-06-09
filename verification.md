# Verification

Last checked: 2026-06-09.

## Local Dry Run

Command:

```sh
pnpm run demo:dry-run
```

Result: passed.

- `artifacts/dry-run/hello.dag.toml` is emitted.
- `artifacts/dry-run/share` is created.
- The CIS profile pack and companion docs are copied.
- `artifacts/dry-run/share/validation.txt` shows all validators exit 0.

Reference artifacts generated from the same flow are checked in under:

```text
artifacts/reference/
```

Key reference anchors:

- `closure_root = "sha256:598b116bf106fcda921befd1b4ddfbfa816e1c4bf19f0299e00def28a1eae281"`
- Zero graph source hash: `sha256:5a8f3689bd05921106a8668c76c44dc8dfb628ddc652c45a6016de9e8946e331`
- CIS profile pack hash: `sha256:161b4eaa448234ac0125c8d2cf8e35c090fd508408df51b329f256a35cdf5136`
- CIS contract count: `16`

## LLM Runbook Validation

The LLM-facing runbook and completed DAG are:

```text
instructions/zerolang-team-demo.runbook.dag.toml
instructions/zerolang-team-demo.completed.dag.toml
```

Validation commands:

```sh
pnpm run demo:validate-completion
python3 "$AGENT_ASSURANCE_ROOT/validators/validate_closure_root.py" instructions/zerolang-team-demo.runbook.dag.toml instructions/zerolang-team-demo.completed.dag.toml --repo-root "$AGENT_ASSURANCE_ROOT"
python3 "$AGENT_ASSURANCE_ROOT/validators/validate_provenance.py" instructions/zerolang-team-demo.runbook.dag.toml instructions/zerolang-team-demo.completed.dag.toml --repo-root .
python3 "$AGENT_ASSURANCE_ROOT/validators/validate_implementation_dag.py" instructions/zerolang-team-demo.runbook.dag.toml --repo-root . --check-paths-exist
python3 "$AGENT_ASSURANCE_ROOT/validators/validate_implementation_dag.py" instructions/zerolang-team-demo.completed.dag.toml --repo-root . --check-paths-exist
```

Result: passed.

## Zerolang Repo Integration History

This demo was first validated inside a Zerolang checkout with:

```sh
rm -rf .zero/dag/e2e-dry-run
pnpm --silent run build:scripts
pnpm --silent run build:test
pnpm --silent run dagtoml:demo -- examples/hello.graph --out .zero/dag/e2e-dry-run/hello.dag.toml
pnpm --silent run dagtoml:share -- examples/hello.graph --out-dir .zero/dag/e2e-dry-run/share
node --test .zero/test-js/zero-cli.test.js --test-name-pattern "DAG-TOML share bundle"
```

Result: passed.

The required Zerolang `pnpm run conformance` command was attempted and blocked before conformance execution because the local environment did not have `VERCEL_OIDC_TOKEN`.

```text
native:test:sandbox requires VERCEL_OIDC_TOKEN. Put it in .env or .env.local, matching the benchmark sandbox runner, or export it before running.
```

## Review History

External review status for the original Zerolang integration:

- Claude: approved.
- Gemini: approved.
- Grok: found blockers, then approved after fixes.
- Mistral/Vibe: approved after final review.

The Grok/Vibe gateway issue encountered during review was logged privately in the gateway tracker.
