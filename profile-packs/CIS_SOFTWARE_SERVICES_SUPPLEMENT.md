# CIS Controls v8.1 Software & Services — Supplement

This document supplements `CIS_SOFTWARE_SERVICES.md` by providing:

1. **Corrected safeguard names** for Control 16 (the original document carried transposed descriptions for 16.7–16.14).
2. **Missing Control 15 safeguards** (15.2, 15.4, 15.5, 15.6, 15.7).
3. **Related controls** for software assurance: Control 2 (Software Inventory), Control 4 (Secure Configuration), Control 7 (Continuous Vulnerability Management), and Control 18 (Penetration Testing).
4. **Implementation Group (IG) mapping** and **NIST CSF 2.0 security function** for every safeguard.
5. **v8.1 additions** — the new `Govern` security function, `Documentation` asset class, and revised glossary terms.

---

## v8.1 vs v8: What Changed

CIS Controls v8.1 (released June 25, 2024) is an iterative update. Key additions relevant to software and service assurance:

| Change Area | Detail |
| :--- | :--- |
| **`Govern` security function** | Added to align with NIST CSF 2.0. Safeguards mapped to `Govern` address policies, processes, and documentation that steer the cybersecurity program (e.g., 16.1, 16.2, 16.6, 18.1, 4.1, 4.2, 7.1). These are **governance artefacts** — the DAG-TOML `spec-contract` kind is the natural falsifiability target. |
| **`Documentation` asset class** | New asset type covering Plans, Policies, Processes, and Procedures. Many governance-function safeguards now carry `Documentation` as their asset class instead of `Software` or `Network`. |
| **Revised asset class mappings** | Safeguards formerly mapped to generic types now carry more specific asset classes (e.g., 16.3 maps to `Software`/`Detect`, 16.9 maps to `Users`/`Protect`). |
| **Expanded glossary** | Reserved words `plan`, `process`, `sensitive data` now have normative definitions, tightening the falsifiability bar for documentation-completeness checks. |
| **NIST CSF 2.0 realignment** | All security function mappings updated; the previous five functions (Identify, Protect, Detect, Respond, Recover) are augmented by `Govern`. |

---

## Implementation Group Reference

| IG | Description | Scope |
| :--- | :--- | :--- |
| **IG1** | Essential cyber hygiene — every enterprise | Foundational safeguards against the most prevalent attacks |
| **IG2** | Includes IG1; for enterprises with security staff and moderate resources | Addresses elevated risk / compliance requirements |
| **IG3** | Includes IG1+IG2; for enterprises with dedicated security experts | Addresses targeted attacks and zero-day threats; required for regulated data |

All Control 16 safeguards start at **IG2** (none at IG1); 16.12, 16.13, and 16.14 start at **IG3**.
All Control 15 safeguards: 15.1 starts at IG1; 15.2–15.5 start at IG2; 15.6–15.7 start at IG3.

---

## 1. Control 16 — Corrected Safeguard Name Table

The original document used non-standard names for safeguards 16.7–16.14. The table below provides the authoritative CIS v8.1 names, asset class, NIST CSF 2.0 function, and starting IG.

| Safeguard | Authoritative CIS v8.1 Name | Asset Class | NIST CSF 2.0 Fn | Starting IG |
| :--- | :--- | :--- | :--- | :--- |
| **16.1** | Establish and Maintain a Secure Application Development Process | Documentation | Govern | IG2 |
| **16.2** | Establish and Maintain a Process to Accept and Address Software Vulnerabilities | Documentation | Govern | IG2 |
| **16.3** | Perform Root Cause Analysis on Security Vulnerabilities | Software | Detect | IG2 |
| **16.4** | Establish and Manage an Inventory of Third-Party Software Components | Software | Identify | IG2 |
| **16.5** | Use Up-to-Date and Trusted Third-Party Software Components | Software | Protect | IG2 |
| **16.6** | Establish and Maintain a Severity Rating System and Process for Application Vulnerabilities | Documentation | Govern | IG2 |
| **16.7** | Use Standard Hardening Configuration Templates for Application Infrastructure | Software | Protect | IG2 |
| **16.8** | Separate Production and Non-Production Systems | Network | Protect | IG2 |
| **16.9** | Train Developers in Application Security Concepts and Secure Coding | Users | Protect | IG2 |
| **16.10** | Apply Secure Design Principles in Application Architectures | Software | Protect | IG2 |
| **16.11** | Leverage Vetted Modules or Services for Application Security Components | Software | Protect | IG2 |
| **16.12** | Implement Code-Level Security Checks | Software | Protect | IG3 |
| **16.13** | Conduct Application Penetration Testing | Software | Detect | IG3 |
| **16.14** | Conduct Threat Modeling | Software | Protect | IG3 |

> **Note:** The original `CIS_SOFTWARE_SERVICES.md` mapped safeguard IDs 16.7–16.14 to descriptions that do not match the authoritative CIS v8.1 text. Specifically: 16.7 (original: "Penetration Testing") should be "Hardening Templates"; 16.8 (original: "Threat Modeling") should be "Prod/Non-Prod Separation"; 16.9 (original: "Secure Architecture") should be "Developer Training"; 16.10 (original: "Coding Standards") should be "Secure Design Principles"; 16.12 (original: "Third-Party Review") should be "Code-Level Security Checks"; 16.13 (original: "OSS Library Review") should be "Application Penetration Testing"; 16.14 (original: "Pipeline Integrity") should be "Threat Modeling". Pipeline integrity / supply chain and OSS review do not have dedicated Control 16 IDs — they are addressed under Control 2, Control 4, and 16.4/16.5.

---

## 2. Control 16 — Omitted Safeguard Mappings

The original document covered all 14 safeguard IDs but with transposed names. The three safeguards below had their substance materially mis-described and require dedicated falsifiability criteria under their correct identity.

---

### 2.1 Hardening Configuration Templates (CIS 16.7)

**Control Objective**

Use standard, industry-recommended hardening configuration templates for application infrastructure components — underlying servers, databases, web servers, cloud containers, PaaS, and SaaS components. In-house software must not weaken hardening baselines (e.g., CIS Benchmarks, DISA STIGs). Asset class: Software. NIST CSF 2.0: Protect. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. An enterprise-maintained configuration standard document (`GV3`) exists and records the approved CIS Benchmark or DISA STIG baseline for each application infrastructure component class; the document must carry a `last_reviewed` timestamp within 12 months.
2. An automated configuration compliance scanner (e.g., CIS-CAT Pro, OpenSCAP) runs against every application infrastructure component at least quarterly and produces a signed, machine-readable compliance report; the report is committed as an evidence artefact in the release closure.
3. The compliance report must show zero unmitigated high-severity findings against the approved baseline; any deviation requires a documented exception with explicit residual risk acceptance signed by an authorized decider.
4. In-house developed software build pipelines include a gate that validates container/image hardening (e.g., Docker CIS Benchmark) and blocks builds that introduce new high-severity configuration regressions.
5. A `spec-contract` invariant asserts that no production deployment unit references a base image or runtime lacking a passing CIS Benchmark scan within the current compliance window.

**DAG-TOML Integration Mapping**

Kind: `spec-contract` (invariant enforcement) + `evidence-matrix` (compliance scan results)

```toml
[[contracts]]
id          = "CIS-16-7"
domain      = "hardening_configuration"
statement   = "Application infrastructure components must meet industry-recommended hardening baselines (CIS Benchmark or equivalent). Automated compliance scans run quarterly; results are committed as signed evidence. Zero unmitigated high-severity deviations permitted at release time."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["configuration_standard_doc", "compliance_scan_report", "scan_timestamp", "baseline_name"]
verified_by = ["adapter-contract:spec-contract-invariants-check@1", "adapter-contract:sast-verifier@1"]
```

---

### 2.2 Production and Non-Production Separation (CIS 16.8)

**Control Objective**

Maintain separate environments for production and non-production systems. This prevents test data from contaminating production, and test-environment attacks from pivoting into production. Asset class: Network. NIST CSF 2.0: Protect. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. The enterprise asset inventory (`GV1`) explicitly tags every asset with an environment label (`production`, `staging`, `development`, `test`); the inventory is reviewed bi-annually.
2. Network segmentation controls (firewall rules, VPC/VLAN boundaries, or namespace isolation) enforce that no direct, unapproved data path exists between production and non-production assets; a network configuration check validates this at build/deploy time.
3. An `implementation-dag` unit records environment boundary rules as code (e.g., IaC / Terraform security group rules); these rules are version-controlled and tied to the release closure root.
4. The automated smoke-validation gate verifies that non-production secrets and credentials do not appear in production environment configurations (e.g., via secret scanning tools integrated into CI).
5. Every production service has at least one corresponding non-production environment; the deployment pipeline fails if a production rollout lacks a pre-production validation step in the `readiness-gate`.

**DAG-TOML Integration Mapping**

Kind: `implementation-dag` (environment isolation as code) + `readiness-gate` (pre-production validation gate)

```toml
[[contracts]]
id          = "CIS-16-8"
domain      = "environment_separation"
statement   = "Production and non-production systems must be network-isolated and tracked separately in the asset inventory. Every production deployment must pass a pre-production validation gate. No direct unapproved data paths between environments."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["environment_label", "network_isolation_rules", "preprod_gate_passed"]
verified_by = ["adapter-contract:smoke-validation-check@1", "adapter-contract:release-signature-check@1"]
```

---

### 2.3 Developer Security Training (CIS 16.9)

**Control Objective**

Ensure all software development personnel receive role-specific training in writing secure code, at least annually. Training must cover general security principles and application security standard practices and be designed to build a security culture within development teams. Asset class: Users. NIST CSF 2.0: Protect. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. A training requirement matrix exists that maps each developer role and primary development environment to a minimum set of approved security courses; the matrix is reviewed annually.
2. For each person in the developer roster, a training completion record with course name, completion date, and the associated role mapping is machine-readable and resolvable from the evidence store; the record must be less than 12 months old.
3. The deployment `readiness-gate` queries the training completion evidence store and blocks release approvals for teams where more than 0% of involved developers lack a current training record.
4. Training completion percentage (trained-in-scope developers / total developers) is exposed as a metric in the `evidence-matrix`; a value below 100% constitutes a control finding.
5. The training requirement matrix and completion records are stored under version control as `Documentation` assets, carrying a `last_reviewed` date and owner attestation.

**DAG-TOML Integration Mapping**

Kind: `evidence-matrix` (training completion evidence) + `readiness-gate` (training currency gate)

```toml
[[contracts]]
id          = "CIS-16-9"
domain      = "developer_security_training"
statement   = "All software development personnel must complete role-specific secure coding training at least annually. Completion records are machine-readable and queried at the deployment readiness gate. Any developer lacking a current training record blocks team-level release approval."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["training_matrix_doc", "training_completion_date", "developer_role", "course_name"]
verified_by = ["adapter-contract:requirements-completeness-check@1", "adapter-contract:release-signature-check@1"]
```

---

## 3. Control 15 — Missing Safeguards (15.2, 15.4, 15.5, 15.6, 15.7)

The original document covered only 15.1 and 15.3. The remaining five safeguards are mapped below.

---

### 3.1 Service Provider Management Policy (CIS 15.2)

**Control Objective**

Establish and maintain a service provider management policy that addresses classification, inventory, assessment, monitoring, and decommissioning of service providers. Review annually. Asset class: Documentation. NIST CSF 2.0: Govern. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. A single authoritative service provider management policy document exists, is version-controlled, and contains explicit sections covering classification criteria, inventory requirements, assessment frequency, monitoring obligations, and decommissioning procedures.
2. The policy document carries a `last_reviewed` timestamp that is less than 12 months old; absence of this timestamp or an older timestamp constitutes a failing score.
3. The policy document is committed as a `Documentation` asset in the release closure and its SHA-256 hash is bound to the `closure_root` so that in-flight modifications are detectable.
4. The `spec-contract` for service provider management references the policy document hash; any hash mismatch at gate-evaluation time fails the contract.

**DAG-TOML Integration Mapping**

Kind: `spec-contract` (policy presence and currency invariant)

```toml
[[contracts]]
id          = "CIS-15-2"
domain      = "service_provider_policy"
statement   = "A service provider management policy must exist, cover all five lifecycle phases (classification, inventory, assessment, monitoring, decommissioning), be reviewed annually, and be hash-bound to the release closure root."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["policy_doc_hash", "policy_last_reviewed", "policy_sections_present"]
verified_by = ["adapter-contract:closure-root-integrity-check@1", "adapter-contract:spec-contract-invariants-check@1"]
```

---

### 3.2 Service Provider Classification (CIS 15.3)

**Control Objective**

Classify all service providers using one or more risk-relevant characteristics: data sensitivity, data volume, availability requirements, applicable regulations, inherent risk, and mitigated risk. Review and update classifications annually. Asset class: Data. NIST CSF 2.0: Identify. Starting IG: IG2.

> **Note:** The original document mapped 15.3 as "Service Access Control." That description corresponds to access restrictions and network isolation — an accurate control objective but one that conflates 15.3 (Classify) with operational enforcement aspects better addressed under Control 4 and Control 12. The authoritative 15.3 objective is risk-based classification.

**Falsifiable Adherence Criteria**

1. Every service provider in the inventory (CIS 15.1) carries a machine-readable risk classification record containing at minimum: data sensitivity tier, data volume category, and an overall inherent-risk rating.
2. Classification records carry a `last_reviewed` date; any record older than 12 months constitutes a failing finding at gate evaluation.
3. The `adapter-registry-binding` for each service provider references its classification record ID; bindings without a valid classification link are rejected by the registry validator.
4. A classification change event (triggered by reclassification) must produce an updated `gate-decision` entry that re-evaluates downstream access controls and contract requirements.

**DAG-TOML Integration Mapping**

Kind: `evidence-matrix` (classification records) + `adapter-registry-binding` (classification linkage)

```toml
[[contracts]]
id          = "CIS-15-3"
domain      = "service_provider_classification"
statement   = "Every service provider must carry a current risk classification record (data sensitivity, data volume, inherent risk) linked from its adapter-registry-binding. Classifications are reviewed annually; stale or missing classifications fail the registry validation gate."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["classification_tier", "data_sensitivity", "inherent_risk_rating", "classification_last_reviewed"]
verified_by = ["adapter-contract:adapter-registry-binding-check@1", "adapter-contract:spec-contract-invariants-check@1"]
```

---

### 3.3 Service Provider Contract Security Requirements (CIS 15.4)

**Control Objective**

Ensure service provider contracts include security requirements consistent with the enterprise's service provider management policy. Minimum contract requirements: minimum security program, incident/breach notification, data encryption requirements, and data disposal commitments. Review contracts annually. Asset class: Data. NIST CSF 2.0: Protect. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. A contract compliance checklist is maintained listing the four minimum security clauses (security program, incident notification, encryption, data disposal); each active service provider contract must map to this checklist.
2. An automated contract review process verifies the presence of all four clauses for each registered service provider; the check result is committed as a signed evidence record linked to the provider's registry entry.
3. Contracts are reviewed annually; the evidence record carries a `contract_review_date`; any record older than 12 months or missing this field fails the gate.
4. A `gate-decision` blocks onboarding of any new service provider whose contract evidence record is absent or fails the clause-presence check.
5. Contracts for providers classified as high data sensitivity (from 15.3) must additionally evidence encryption-in-transit and encryption-at-rest requirements; absence of these fields for high-sensitivity providers is a critical finding.

**DAG-TOML Integration Mapping**

Kind: `spec-contract` (contract clause invariants) + `gate-decision` (onboarding gate)

```toml
[[contracts]]
id          = "CIS-15-4"
domain      = "service_provider_contract_requirements"
statement   = "Every service provider contract must evidence minimum security clauses: security program, breach notification, data encryption, and data disposal. Contracts are reviewed annually. New provider onboarding is blocked without a passing contract evidence record."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["contract_review_date", "security_program_clause", "breach_notification_clause", "encryption_clause", "data_disposal_clause"]
verified_by = ["adapter-contract:spec-contract-invariants-check@1", "adapter-contract:closure-root-integrity-check@1"]
```

---

### 3.4 Service Provider Assessment (CIS 15.5)

**Control Objective**

Assess service providers consistent with the enterprise's service provider management policy. Assessment scope varies by classification and may include SOC 2 reports, PCI AoC, customized questionnaires, or other rigorous processes. Reassess annually at minimum, or with new/renewed contracts. Asset class: Data. NIST CSF 2.0: Identify. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. An assessment record exists for every active service provider; the record names the assessment type (SOC 2, PCI AoC, custom questionnaire, etc.) and links to the source document or report.
2. Assessment records carry a `last_assessed_date`; records older than 12 months constitute a failing finding; records for newly onboarded providers must exist within 30 days of go-live.
3. The assessment type must be consistent with the provider's classification tier (from 15.3); lower-tier providers may use questionnaires, but providers handling sensitive data must have a standardized third-party report (SOC 2 Type II or equivalent).
4. Assessment findings are tracked as structured items in the `evidence-matrix`; each finding with a critical severity must have a documented remediation plan or accepted exception.
5. A `readiness-gate` check verifies that no service provider in active use has a lapsed or missing assessment record before permitting a production deployment that depends on that provider.

**DAG-TOML Integration Mapping**

Kind: `evidence-matrix` (assessment records) + `readiness-gate` (assessment currency gate)

```toml
[[contracts]]
id          = "CIS-15-5"
domain      = "service_provider_assessment"
statement   = "Every active service provider must have a current assessment record (SOC 2, PCI AoC, or approved equivalent). Assessment type must match classification tier. Lapsed or missing assessment records block production deployments that depend on that provider."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["assessment_type", "last_assessed_date", "assessment_report_hash", "assessment_findings_count"]
verified_by = ["adapter-contract:test-coverage-check@1", "adapter-contract:requirements-completeness-check@1"]
```

---

### 3.5 Service Provider Monitoring (CIS 15.6)

**Control Objective**

Monitor service providers consistent with the enterprise's service provider management policy. Monitoring may include periodic reassessment of compliance, monitoring provider release notes, and dark web monitoring. Asset class: Data. NIST CSF 2.0: Detect. Starting IG: IG3.

**Falsifiable Adherence Criteria**

1. A monitoring schedule exists for each service provider tier; the schedule specifies monitoring frequency and method (compliance reassessment cadence, release-note review, dark web alert integration).
2. Automated ingestion of provider security advisories and release notes is configured for all high-classification providers; ingested events are stored as machine-readable records with `event_type`, `provider_id`, and `received_timestamp`.
3. Dark web monitoring alerts referencing registered provider domains or IP ranges are routed into the enterprise's incident tracking system within 24 hours of alert generation; the routing configuration is testable via the `smoke-validation` gate.
4. Monthly monitoring summary reports exist for all IG3-scope providers; each report is signed by the responsible contact and committed as an evidence artefact.
5. Any monitoring event that triggers a compliance concern must produce a `threat-model` update for the affected provider relationship, with a documented re-assessment timeline.

**DAG-TOML Integration Mapping**

Kind: `threat-model` (provider risk event tracking) + `evidence-matrix` (monitoring summary records)

```toml
[[contracts]]
id          = "CIS-15-6"
domain      = "service_provider_monitoring"
statement   = "Active service providers must be monitored per policy: automated ingestion of security advisories, dark web alerts routed within 24 hours, and signed monthly monitoring summaries committed as evidence. Compliance-triggering events must update the provider threat model."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["monitoring_schedule_doc", "advisory_ingestion_enabled", "dark_web_alert_routing", "monitoring_summary_date"]
verified_by = ["adapter-contract:smoke-validation-check@1", "adapter-contract:design-threat-check@1"]
```

---

### 3.6 Secure Service Provider Decommissioning (CIS 15.7)

**Control Objective**

Securely decommission service providers. Considerations include user and service account deactivation, termination of data flows, and secure disposal of enterprise data within provider systems. Asset class: Data. NIST CSF 2.0: Protect. Starting IG: IG3.

**Falsifiable Adherence Criteria**

1. A decommissioning checklist exists for service providers, covering at minimum: deactivation of all user and service accounts, revocation of API keys and OAuth tokens, termination of all active data flows and webhooks, and confirmation of enterprise data deletion or return.
2. Decommissioning events produce a machine-readable closure record containing the checklist item completion status, timestamps, and responsible party identifiers; the record is signed by an authorized decider and committed to the evidence store.
3. The `adapter-registry-binding` for a decommissioned provider must be removed or marked `status = "decommissioned"` within 24 hours of the decommission event; stale active bindings to decommissioned providers fail the registry validation gate.
4. A `rollback-plan` entry documents the data-recovery and service-substitution procedure for each high-classification provider prior to decommissioning, ensuring operational continuity is not compromised.
5. Post-decommission, an automated scan confirms no remaining active credentials, tokens, or network routes reference the decommissioned provider; the scan result is committed as a final evidence artefact.

**DAG-TOML Integration Mapping**

Kind: `rollback-plan` (continuity and data recovery) + `gate-decision` (decommission closure sign-off)

```toml
[[contracts]]
id          = "CIS-15-7"
domain      = "service_provider_decommissioning"
statement   = "Service provider decommissioning must produce a signed closure record confirming account deactivation, data-flow termination, and data disposal. Registry bindings must be marked decommissioned within 24 hours. A post-decommission credential scan must confirm no residual access."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["decommission_checklist_complete", "accounts_deactivated", "data_flows_terminated", "data_disposal_confirmed", "post_decommission_scan_clean"]
verified_by = ["adapter-contract:adapter-registry-binding-check@1", "adapter-contract:closure-root-integrity-check@1"]
```

---

## 4. Control 2 — Inventory and Control of Software Assets

**Why this control matters for software assurance:** Control 2 is a direct prerequisite for Controls 16.4, 16.5, 16.11, 16.12, 16.13, and 16.14. Without an authoritative software inventory (`GV5`), automated checks for SBOM completeness, dependency scanning, and code-level security analysis have no enumeration surface to operate against.

### 4.1 Software Inventory Safeguard Table

| Safeguard | Name | Asset Class | NIST CSF 2.0 Fn | Starting IG |
| :--- | :--- | :--- | :--- | :--- |
| **2.1** | Establish and Maintain a Software Inventory | Software | Identify | IG1 |
| **2.2** | Ensure Authorized Software is Currently Supported | Software | Identify | IG1 |
| **2.3** | Address Unauthorized Software | Software | Respond | IG1 |
| **2.4** | Utilize Automated Software Inventory Tools | Software | Detect | IG2 |
| **2.5** | Allowlist Authorized Software | Software | Protect | IG2 |
| **2.6** | Allowlist Authorized Libraries | Software | Protect | IG2 |
| **2.7** | Allowlist Authorized Scripts | Software | Protect | IG3 |

### 4.2 Software Inventory (CIS 2.1)

**Control Objective**

Establish and maintain a detailed inventory of all licensed software installed on enterprise assets. Must document title, publisher, install/use date, business purpose, version(s), deployment mechanism, and decommission date. Review bi-annually or more frequently. Starting IG: IG1.

**Falsifiable Adherence Criteria**

1. The authorized software inventory (`GV5`) is a machine-readable file committed in the repository; it must contain entries for title, publisher, install date, business purpose, version, and deployment mechanism for every installed software item.
2. The `last_updated` timestamp on `GV5` must be no older than six months; a gap exceeding six months produces a failing score for this safeguard at gate evaluation time.
3. Each entry in `GV5` carries an `authorization_status` field (`authorized`, `unauthorized`, `exception`); entries without this field are treated as unauthorized.
4. The `closure_root` of every release bundle references the SHA-256 hash of `GV5` at build time; a hash mismatch between build-time and gate-evaluation-time inventory indicates an untrusted inventory state.

**DAG-TOML Integration Mapping**

Kind: `traceability` (inventory as code, bi-directional) + `spec-contract` (inventory completeness invariant)

```toml
[[contracts]]
id          = "CIS-2-1"
domain      = "software_inventory"
statement   = "An authorized software inventory (GV5) must exist as a machine-readable artefact, updated at least bi-annually, with complete metadata per entry. Its hash must be bound to the release closure root. Missing or stale inventory constitutes a gate failure."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["gv5_inventory_hash", "inventory_last_updated", "authorization_status"]
verified_by = ["adapter-contract:sbom-verifier@1", "adapter-contract:closure-root-integrity-check@1"]
```

### 4.3 Authorized Software Support Status (CIS 2.2)

**Control Objective**

Ensure only currently supported software is authorized. Unsupported software used for mission-critical purposes requires documented exception with residual risk acceptance. Review monthly. Starting IG: IG1.

**Falsifiable Adherence Criteria**

1. A monthly automated scan cross-references `GV5` against vendor end-of-support announcements (via NVD, vendor APIs, or equivalent authoritative source); results are stored as a machine-readable report.
2. Any software item flagged as unsupported without a documented exception record is automatically set to `authorization_status = "unauthorized"` in `GV5`; this change triggers a build gate failure if the affected software is referenced in any active deployment unit.
3. Exception records for unsupported software must contain: justification, mitigating controls, residual risk acceptance signed by an authorized decider, and an expiry date; the validator rejects expired exceptions.

**DAG-TOML Integration Mapping**

Kind: `spec-contract` (support-status invariant) + `threat-model` (residual risk for exceptions)

```toml
[[contracts]]
id          = "CIS-2-2"
domain      = "software_support_status"
statement   = "Only currently supported software may carry authorized status. Unsupported software requires a signed, time-bounded exception. Monthly automated scans update authorization_status; unauthorized software without exception blocks deployment."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["software_support_status", "exception_expiry_date", "residual_risk_acceptance"]
verified_by = ["adapter-contract:dependency-scanner-check@1", "adapter-contract:sbom-verifier@1"]
```

### 4.4 Allowlist Authorized Software (CIS 2.5)

**Control Objective**

Use technical controls (application allowlisting) to ensure only authorized software can execute. Reassess bi-annually. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. Allowlisting controls are deployed and configured on all enterprise assets capable of supporting them; a technical inventory of coverage (assets with allowlisting / total allowlisting-capable assets) is produced bi-annually and must be ≥ 95%.
2. Allowlist configuration is maintained as code (version-controlled), tied to the approved `GV5` snapshot; configuration drift from the approved snapshot is detected by a scheduled smoke-validation check.
3. Any execution of software not present in `GV5` with `authorization_status = "authorized"` produces an alert routed to the incident tracking system within 15 minutes.

**DAG-TOML Integration Mapping**

Kind: `implementation-dag` (allowlist-as-code) + `evidence-matrix` (coverage metric)

```toml
[[contracts]]
id          = "CIS-2-5"
domain      = "software_allowlisting"
statement   = "Application allowlisting must be deployed on all capable assets with ≥95% coverage, maintained as version-controlled configuration tied to GV5, and checked bi-annually. Unauthorized execution events must alert within 15 minutes."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["allowlist_coverage_pct", "allowlist_config_hash", "last_allowlist_assessment_date"]
verified_by = ["adapter-contract:smoke-validation-check@1", "adapter-contract:spec-contract-invariants-check@1"]
```

---

## 5. Control 4 — Secure Configuration of Enterprise Assets and Software

**Why this control matters for software assurance:** Control 4 establishes the configuration baselines that 16.7 (Hardening Templates) depends on. Safeguards 4.1 and 4.2 introduce `Documentation`/`Govern` type safeguards — the earliest IG1 entries that carry the v8.1 `Govern` function.

### 5.1 Secure Configuration Safeguard Table

| Safeguard | Name | Asset Class | NIST CSF 2.0 Fn | Starting IG |
| :--- | :--- | :--- | :--- | :--- |
| **4.1** | Establish and Maintain a Secure Configuration Process | Documentation | Govern | IG1 |
| **4.2** | Establish and Maintain a Secure Configuration Process for Network Infrastructure | Documentation | Govern | IG1 |
| **4.3** | Configure Automatic Session Locking on Enterprise Assets | Devices | Protect | IG1 |
| **4.4** | Implement and Manage a Firewall on Servers | Devices | Protect | IG1 |
| **4.5** | Implement and Manage a Firewall on End-User Devices | Devices | Protect | IG1 |
| **4.6** | Securely Manage Enterprise Assets and Software | Devices | Protect | IG1 |
| **4.7** | Manage Default Accounts on Enterprise Assets and Software | Users | Protect | IG1 |
| **4.8** | Uninstall or Disable Unnecessary Services on Enterprise Assets | Software | Protect | IG2 |
| **4.9** | Configure Trusted DNS Servers on Enterprise Assets | Devices | Protect | IG2 |
| **4.10** | Enforce Automatic Device Lockout on Portable End-User Devices | Devices | Protect | IG2 |
| **4.11** | Enforce Remote Wipe Capability on Portable End-User Devices | Devices | Protect | IG2 |
| **4.12** | Separate Enterprise Workspaces on Mobile End-User Devices | Devices | Protect | IG2 |

### 5.2 Secure Configuration Process (CIS 4.1)

**Control Objective**

Establish and maintain a documented secure configuration process for all enterprise assets and software (endpoints, mobile, IoT, servers, OS, applications). Review annually. Asset class: Documentation. NIST CSF 2.0: Govern. Starting IG: IG1.

This is the v8.1 `Govern` function in action at IG1 — the configuration standard (`GV3`) is a governance artefact that must be falsifiably present, current, and hash-bound.

**Falsifiable Adherence Criteria**

1. The configuration standard document (`GV3`) exists as a version-controlled file in the repository; it references approved CIS Benchmarks, DISA STIGs, or USGCB baselines for each asset class and records any enterprise-approved deviations.
2. `GV3` carries a `last_reviewed` timestamp that is less than 12 months old; an older or absent timestamp fails this safeguard's gate check immediately.
3. A `spec-contract` invariant references the SHA-256 hash of `GV3`; any in-flight modification to the configuration standard without an accompanying gate-decision record constitutes a contract violation.
4. Every deployment unit references the `GV3` version that was current at build time via the `implementation-dag` closure; retrospective changes to `GV3` do not retroactively validate prior deployments.

**DAG-TOML Integration Mapping**

Kind: `spec-contract` (configuration baseline governance invariant)

```toml
[[contracts]]
id          = "CIS-4-1"
domain      = "secure_configuration_process"
statement   = "A secure configuration standard (GV3) must exist for all enterprise asset classes, reference approved baselines (CIS Benchmark / DISA STIG), be reviewed annually, and have its hash bound to every deployment closure. Stale or absent GV3 fails the gate."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["gv3_config_standard_hash", "config_standard_last_reviewed", "baseline_reference"]
verified_by = ["adapter-contract:spec-contract-invariants-check@1", "adapter-contract:closure-root-integrity-check@1"]
```

### 5.3 Network Infrastructure Configuration Process (CIS 4.2)

**Control Objective**

Establish and maintain a documented secure configuration process for network devices. Review annually. Asset class: Documentation. NIST CSF 2.0: Govern. Starting IG: IG1.

**Falsifiable Adherence Criteria**

1. A network infrastructure configuration standard exists as a version-controlled document referencing approved baseline templates for all network device classes; it is reviewed annually.
2. Network device configurations are managed as infrastructure-as-code and stored in the repository; drift from the approved baseline is detected automatically by a scheduled compliance scan.
3. The compliance scan output is a signed, machine-readable report committed to the evidence store at each pipeline run; the report must show no unmitigated high-severity deviations.

**DAG-TOML Integration Mapping**

Kind: `spec-contract` (network configuration governance invariant) + `implementation-dag` (IaC-based drift detection)

```toml
[[contracts]]
id          = "CIS-4-2"
domain      = "network_configuration_process"
statement   = "A network infrastructure configuration standard must exist, reference approved baselines, be reviewed annually, and be managed as infrastructure-as-code. Drift detection scans run automatically and must produce zero unmitigated high-severity findings."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["network_config_standard_hash", "network_config_last_reviewed", "drift_scan_report"]
verified_by = ["adapter-contract:spec-contract-invariants-check@1", "adapter-contract:sast-verifier@1"]
```

---

## 6. Control 7 — Continuous Vulnerability Management

**Why this control matters for software assurance:** Control 7 is the operational counterpart to Control 16's vulnerability-intake (16.2) and severity-rating (16.6) safeguards. It provides the scanning, patching, and remediation cadence that keeps the vulnerability management posture current.

### 6.1 Vulnerability Management Safeguard Table

| Safeguard | Name | Asset Class | NIST CSF 2.0 Fn | Starting IG |
| :--- | :--- | :--- | :--- | :--- |
| **7.1** | Establish and Maintain a Vulnerability Management Process | Documentation | Govern | IG1 |
| **7.2** | Establish and Maintain a Remediation Process | Documentation | Respond | IG1 |
| **7.3** | Perform Automated Operating System Patch Management | Devices | Protect | IG1 |
| **7.4** | Perform Automated Application Patch Management | Applications | Protect | IG1 |
| **7.5** | Perform Automated Vulnerability Scans of Internal Enterprise Assets | Devices | Identify | IG2 |
| **7.6** | Perform Automated Vulnerability Scans of Externally-Exposed Enterprise Assets | Devices | Identify | IG2 |
| **7.7** | Remediate Detected Vulnerabilities | Applications | Respond | IG2 |

### 6.2 Vulnerability Management Process (CIS 7.1)

**Control Objective**

Establish and maintain a documented vulnerability management process for all enterprise assets. Review and update annually or when significant enterprise changes occur. Asset class: Documentation. NIST CSF 2.0: Govern. Starting IG: IG1.

**Falsifiable Adherence Criteria**

1. The vulnerability management process document exists as a version-controlled file; it must specify scanning cadence, severity thresholds, escalation procedures, and remediation SLAs.
2. The document carries a `last_reviewed` timestamp less than 12 months old; an older timestamp constitutes an immediate gate failure.
3. A `spec-contract` invariant references the process document hash; the invariant fails if the process references severity thresholds inconsistent with those declared in the CIS 16.6 severity rating system.

**DAG-TOML Integration Mapping**

Kind: `spec-contract` (vulnerability management governance invariant)

```toml
[[contracts]]
id          = "CIS-7-1"
domain      = "vulnerability_management_process"
statement   = "A vulnerability management process document must exist, specify scanning cadence and remediation SLAs, be reviewed annually, and have its hash cross-referenced with the CIS-16-6 severity rating system for consistency. Stale or inconsistent process documents fail the gate."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["vuln_mgmt_process_hash", "process_last_reviewed", "severity_threshold_ref"]
verified_by = ["adapter-contract:spec-contract-invariants-check@1", "adapter-contract:requirements-completeness-check@1"]
```

### 6.3 Remediation Process (CIS 7.2)

**Control Objective**

Establish and maintain a risk-based remediation strategy documented in a remediation process, with monthly or more frequent reviews. Asset class: Documentation. NIST CSF 2.0: Respond. Starting IG: IG1.

**Falsifiable Adherence Criteria**

1. The remediation process document exists and specifies SLAs by CVSS severity band (e.g., Critical: 7 days, High: 30 days, Medium: 90 days).
2. Each open vulnerability in the tracking system has an assigned remediation deadline computed from its CVSS score and the SLA table; violations of SLA deadlines produce automatic escalation events.
3. Monthly remediation metrics (open/closed/overdue per severity band) are produced as machine-readable evidence artefacts; an `evidence-matrix` record captures these metrics with a `metric_date` field.

**DAG-TOML Integration Mapping**

Kind: `evidence-matrix` (remediation metrics) + `spec-contract` (SLA invariants)

```toml
[[contracts]]
id          = "CIS-7-2"
domain      = "vulnerability_remediation_process"
statement   = "A risk-based remediation process must exist with CVSS-banded SLAs. Monthly metrics (open/closed/overdue per severity) are committed as evidence. SLA violations auto-escalate. Missing or overdue remediation records for critical findings block release gates."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["remediation_sla_table", "open_critical_count", "overdue_critical_count", "remediation_metric_date"]
verified_by = ["adapter-contract:sast-verifier@1", "adapter-contract:requirements-completeness-check@1"]
```

### 6.4 Automated Vulnerability Scans — Internal (CIS 7.5)

**Control Objective**

Perform automated vulnerability scans of internal enterprise assets on a quarterly or more frequent basis using a SCAP-compliant tool; conduct both authenticated and unauthenticated scans. Asset class: Devices. NIST CSF 2.0: Identify. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. A SCAP-compliant vulnerability scanner is registered in the toolchain inventory; its scan schedule is configured for quarterly or more frequent execution.
2. Every quarterly scan produces a signed, machine-readable report stored in the evidence artefact store; report timestamps must not be more than 95 days apart (to verify quarterly cadence is met).
3. The scan must include authenticated scans; the scan configuration file (version-controlled) must include authentication credentials binding (reference, not the actual credential) for each asset class.
4. A `readiness-gate` check verifies that the most recent scan report is less than 95 days old before approving a production deployment.

**DAG-TOML Integration Mapping**

Kind: `evidence-matrix` (scan reports) + `readiness-gate` (scan currency gate)

```toml
[[contracts]]
id          = "CIS-7-5"
domain      = "internal_vulnerability_scanning"
statement   = "Automated SCAP-compliant vulnerability scans of internal assets run at least quarterly, producing signed evidence reports. Reports must be less than 95 days old at production deployment time. Authenticated scans must be included in scan configuration."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["scan_report_timestamp", "scan_tool_name", "authenticated_scan_enabled", "scan_report_hash"]
verified_by = ["adapter-contract:test-coverage-check@1", "adapter-contract:release-signature-check@1"]
```

### 6.5 Remediate Detected Vulnerabilities (CIS 7.7)

**Control Objective**

Remediate detected vulnerabilities in software through processes and tooling on a monthly or more frequent basis, based on the remediation process. Asset class: Applications. NIST CSF 2.0: Respond. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. Every vulnerability finding in the tracking system carries a `remediation_status` field (`open`, `in_progress`, `remediated`, `exception`); the field is updated by the remediation toolchain (not manually).
2. Critical and High CVSS findings must reach `remediated` or `exception` status within the SLAs defined in CIS 7.2; any finding that exceeds its SLA deadline and lacks an `exception` record blocks the next production release gate.
3. Remediation is verified by a follow-up scan that confirms the finding is no longer present; the verification scan report is committed as a closing evidence artefact linked to the original finding ID.

**DAG-TOML Integration Mapping**

Kind: `evidence-matrix` (remediation status tracking) + `gate-decision` (SLA-breach release block)

```toml
[[contracts]]
id          = "CIS-7-7"
domain      = "vulnerability_remediation"
statement   = "All detected vulnerabilities must carry a machine-updated remediation_status. Critical and High findings must be remediated or excepted within SLA; SLA-breaching findings without exceptions block production release gates. Remediation is verified by a follow-up scan."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["finding_id", "remediation_status", "remediation_closed_date", "verification_scan_report"]
verified_by = ["adapter-contract:sast-verifier@1", "adapter-contract:agent-autonomy-check@1"]
```

---

## 7. Control 18 — Penetration Testing

**Why this control matters for software assurance:** Control 18 is the IG2/IG3 counterpart to CIS 16.13 (Application Penetration Testing). Whereas 16.13 is scoped to applications, Control 18 governs the enterprise-wide penetration testing program covering networks, APIs, hosted services, and physical controls.

### 7.1 Penetration Testing Safeguard Table

| Safeguard | Name | Asset Class | NIST CSF 2.0 Fn | Starting IG |
| :--- | :--- | :--- | :--- | :--- |
| **18.1** | Establish and Maintain a Penetration Testing Program | Documentation | Govern | IG2 |
| **18.2** | Perform Periodic External Penetration Tests | Network | Detect | IG2 |
| **18.3** | Remediate Penetration Test Findings | Network | Protect | IG2 |
| **18.4** | Validate Security Measures | Network | Protect | IG3 |
| **18.5** | Perform Periodic Internal Penetration Tests | Network | Detect | IG3 |

### 7.2 Penetration Testing Program (CIS 18.1)

**Control Objective**

Establish and maintain a penetration testing program appropriate to the enterprise's size, complexity, industry, and maturity. Program must define scope (network, web app, API, hosted services, physical), frequency, limitations, point of contact, remediation routing, and retrospective requirements. Asset class: Documentation. NIST CSF 2.0: Govern. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. A penetration testing program document exists as a version-controlled file; it must contain explicit sections for scope, frequency, limitations, contact, remediation routing, and retrospective requirements.
2. The program document carries a `last_reviewed` timestamp less than 12 months old; absence or staleness fails the gate.
3. The program document is hash-bound to the `closure_root` as a `Documentation` asset, consistent with v8.1's new asset class.
4. The scope section must explicitly list coverage for web application and API testing in addition to network-level testing; programs covering only network-level scope for IG2+ enterprises fail the completeness check.

**DAG-TOML Integration Mapping**

Kind: `spec-contract` (program scope and governance invariant)

```toml
[[contracts]]
id          = "CIS-18-1"
domain      = "penetration_testing_program"
statement   = "A penetration testing program document must exist covering scope (network, web app, API, hosted services), frequency, limitations, remediation routing, and retrospectives. It must be reviewed annually and hash-bound to the release closure. API/web-app scope is required for IG2+ enterprises."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["pentest_program_hash", "pentest_program_last_reviewed", "pentest_scope_includes_api", "pentest_scope_includes_webapp"]
verified_by = ["adapter-contract:spec-contract-invariants-check@1", "adapter-contract:closure-root-integrity-check@1"]
```

### 7.3 External Penetration Tests (CIS 18.2)

**Control Objective**

Perform periodic external penetration tests at least annually. Tests must include enterprise and environmental reconnaissance to detect exploitable information, and must be conducted by a qualified party. May be clear-box or opaque-box. Asset class: Network. NIST CSF 2.0: Detect. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. An external penetration test report exists, signed by the qualified testing party (named individual or accredited organization), dated within the last 12 months.
2. The report includes a reconnaissance phase summary; absence of reconnaissance evidence in the report constitutes an incomplete test finding.
3. The report is committed as a signed evidence artefact in the evidence store; its hash is bound to the `evidence-matrix`; a report older than 12 months fails the annual currency check.
4. A `readiness-gate` check verifies the presence of a current external pentest report before approving a major version release or significant infrastructure change.

**DAG-TOML Integration Mapping**

Kind: `evidence-matrix` (pentest report evidence) + `readiness-gate` (annual currency gate)

```toml
[[contracts]]
id          = "CIS-18-2"
domain      = "external_penetration_testing"
statement   = "An external penetration test, including a reconnaissance phase, must be conducted at least annually by a qualified party. The signed report is committed as evidence with its hash in the evidence-matrix. A stale or unsigned report fails the major-release readiness gate."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["external_pentest_report_hash", "external_pentest_date", "tester_qualifications", "reconnaissance_phase_present"]
verified_by = ["adapter-contract:test-coverage-check@1", "adapter-contract:release-signature-check@1"]
```

### 7.4 Remediate Penetration Test Findings (CIS 18.3)

**Control Objective**

Remediate penetration test findings based on the enterprise's remediation policy scope and prioritization. Asset class: Network. NIST CSF 2.0: Protect. Starting IG: IG2.

**Falsifiable Adherence Criteria**

1. Every finding from a penetration test report is entered into the vulnerability tracking system within 5 business days of report delivery; the tracking entry references the source pentest report hash.
2. Each finding carries a severity rating mapped to the CVSS-banded SLA table from CIS 7.2; critical findings from penetration tests are treated at the same remediation priority as scanner-detected Critical findings.
3. A `gate-decision` record is produced at each subsequent release gate listing: count of open pentest findings by severity, count remediated since last gate, and count with accepted exceptions; zero unmitigated critical findings is required for gate passage.

**DAG-TOML Integration Mapping**

Kind: `gate-decision` (pentest finding remediation gate) + `evidence-matrix` (finding tracking)

```toml
[[contracts]]
id          = "CIS-18-3"
domain      = "pentest_finding_remediation"
statement   = "All penetration test findings must be tracked in the vulnerability system within 5 business days, prioritized per the CIS-7-2 SLA table. Zero unmitigated critical pentest findings are permitted at release gate. Open finding counts by severity must appear in every gate-decision record."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["pentest_finding_id", "finding_severity", "remediation_status", "open_critical_pentest_count"]
verified_by = ["adapter-contract:requirements-completeness-check@1", "adapter-contract:agent-autonomy-check@1"]
```

### 7.5 Validate Security Measures (CIS 18.4)

**Control Objective**

Validate security measures after each penetration test. If necessary, modify detection rulesets and capabilities to detect techniques used during testing. Asset class: Network. NIST CSF 2.0: Protect. Starting IG: IG3.

**Falsifiable Adherence Criteria**

1. A post-pentest validation report exists for each penetration test engagement; the report documents the outcome of reviewing detection controls against attack techniques observed in the test.
2. Each technique observed during the penetration test is cross-referenced with the detection rulesets (SIEM rules, IDS signatures, EDR policies); gaps are recorded as actionable items with assigned owners.
3. Where detection rulesets are updated in response to pentest findings, the update is committed as a version-controlled change; the commit is linked to the source finding ID in the tracking system.
4. The validation report and any ruleset change records are committed as evidence artefacts linked to the corresponding pentest report hash.

**DAG-TOML Integration Mapping**

Kind: `threat-model` (detection gap analysis) + `implementation-dag` (ruleset update as code)

```toml
[[contracts]]
id          = "CIS-18-4"
domain      = "security_measure_validation"
statement   = "After each penetration test, detection rulesets must be validated against observed attack techniques. Detection gaps are recorded as actionable items. Ruleset updates are committed as versioned code changes linked to source finding IDs and evidenced in the pentest closure record."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["validation_report_hash", "detection_gap_count", "ruleset_update_commit_ref", "pentest_report_ref"]
verified_by = ["adapter-contract:design-threat-check@1", "adapter-contract:closure-root-integrity-check@1"]
```

### 7.6 Internal Penetration Tests (CIS 18.5)

**Control Objective**

Perform periodic internal penetration tests at least annually based on program requirements. May be clear-box or opaque-box. Asset class: Network. NIST CSF 2.0: Detect. Starting IG: IG3.

**Falsifiable Adherence Criteria**

1. An internal penetration test report exists, dated within the last 12 months, covering the scope defined in the penetration testing program (CIS 18.1).
2. The internal test is distinct from the external test (CIS 18.2); the test report must document its internal-network starting position and the absence of external reconnaissance as the initial access vector.
3. The signed internal pentest report is committed as an evidence artefact with its hash in the `evidence-matrix`; a report older than 12 months fails the annual currency check for IG3 enterprises.

**DAG-TOML Integration Mapping**

Kind: `evidence-matrix` (internal pentest report evidence) + `readiness-gate` (IG3 annual currency gate)

```toml
[[contracts]]
id          = "CIS-18-5"
domain      = "internal_penetration_testing"
statement   = "An internal penetration test must be conducted at least annually for IG3 enterprises, distinct from the external test, with scope per the CIS-18-1 program. The signed report is hash-bound in the evidence-matrix. Stale or absent reports fail the IG3 readiness gate."
applies_to  = ["policy-pack-cis-controls"]
must_name   = ["internal_pentest_report_hash", "internal_pentest_date", "test_scope_ref", "internal_start_position_documented"]
verified_by = ["adapter-contract:test-coverage-check@1", "adapter-contract:release-signature-check@1"]
```

---

## 8. Gap Summary Table

The table below consolidates what the original `CIS_SOFTWARE_SERVICES.md` covers, what it names incorrectly, and what this supplement adds.

| Safeguard | Status in Original | Issue / Supplement Action |
| :--- | :--- | :--- |
| 16.1–16.6 | Covered, names correct | No change needed |
| 16.7 | **Name wrong** (labeled "Penetration Testing") | Supplement §2.1: Hardening Configuration Templates |
| 16.8 | **Name wrong** (labeled "Threat Modeling") | Supplement §2.2: Prod/Non-Prod Separation |
| 16.9 | **Name wrong** (labeled "Secure Architecture") | Supplement §2.3: Developer Security Training |
| 16.10 | **Name wrong** (labeled "Coding Standards") | Correct name: Apply Secure Design Principles |
| 16.11 | Name approximately correct | Correct name: Leverage Vetted Modules or Services |
| 16.12 | **Name wrong** (labeled "Third-Party Review") | Correct name: Implement Code-Level Security Checks |
| 16.13 | **Name wrong** (labeled "OSS Library Review") | Correct name: Conduct Application Penetration Testing |
| 16.14 | **Name wrong** (labeled "Pipeline Integrity") | Correct name: Conduct Threat Modeling |
| 15.1 | Covered | No change needed |
| 15.2 | **Missing** | Supplement §3.1 |
| 15.3 | Covered but description wrong (access control vs. classification) | Supplement §3.2 corrects scope |
| 15.4 | **Missing** | Supplement §3.3 |
| 15.5 | **Missing** | Supplement §3.4 |
| 15.6 | **Missing** | Supplement §3.5 |
| 15.7 | **Missing** | Supplement §3.6 |
| 2.1–2.7 | **Entirely absent** | Supplement §4 (2.1, 2.2, 2.5 mapped) |
| 4.1–4.12 | **Entirely absent** | Supplement §5 (4.1, 4.2 mapped) |
| 7.1–7.7 | **Entirely absent** | Supplement §6 (7.1, 7.2, 7.5, 7.7 mapped) |
| 18.1–18.5 | **Entirely absent** | Supplement §7 (all five mapped) |
| IG mapping | **Entirely absent** | Added to every safeguard in supplement |
| NIST CSF 2.0 function | **Entirely absent** | Added to every safeguard in supplement |
| `Govern` function coverage | **Entirely absent** | Addressed in §1 (v8.1 changes) and throughout |
| `Documentation` asset class | **Entirely absent** | Addressed in §1 and safeguards 16.1, 16.2, 16.6, 4.1, 4.2, 7.1, 18.1 |

---

## Sources

1. CIS Critical Security Controls v8.1 — Official landing page and change summary:
   `https://www.cisecurity.org/controls/v8-1`

2. CIS Controls v8.1 Assessment Specification — Control 16 (Application Software Security), all 14 safeguards with asset classes, security functions, IGs, and measurement operations:
   `https://cas.docs.cisecurity.org/en/latest/source/Controls16/`

3. CIS Controls v8.1 Assessment Specification — Control 15 (Service Provider Management), all 7 safeguards:
   `https://cas.docs.cisecurity.org/en/latest/source/Controls15/`

4. CIS Controls v8.1 Assessment Specification — Control 18 (Penetration Testing), all 5 safeguards:
   `https://cas.docs.cisecurity.org/en/latest/source/Controls18/`

5. CSF.tools CIS Controls v8.1 Reference — Controls 2, 7, 15, 16 with related NIST SP 800-53 Rev. 5.2.0 and Cloud Controls Matrix mappings:
   `https://csf.tools/reference/critical-security-controls/v8-1/`

6. Tripwire — "What's Changed in CIS Critical Security Controls v8.1?" (Governance security function, Documentation asset class, NIST CSF 2.0 realignment):
   `https://www.tripwire.com/state-of-security/whats-changed-cis-critical-security-controls`

7. Ionix — CIS Control 16 Explained with NIST Security Function and starting IG per safeguard:
   `https://www.ionix.io/guides/18-cis-controls/cis-control-explained-16/`
