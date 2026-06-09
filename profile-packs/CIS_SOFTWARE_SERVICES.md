# CIS Controls v8.1 Software & Services Security Mapping

This document provides a comprehensive analysis of the **Center for Internet Security (CIS) Critical Security Controls v8.1** (specifically focusing on **Control 16: Application Software Security** and **Control 15: Service Provider Management**) and the **CIS Software Supply Chain Security Guide**. 

Importantly, this analysis goes beyond simple technical checkers to address **policy-level controls** (such as developer training, service agreements, vulnerability disclosure, and root-cause analysis) that require strict technical and programmatic implementations to be verifiable and falsifiable.

---

## 1. Bridging the Gap: Policy Controls with Technical Implementation

Traditional security audits treat policies as written documents (e.g., "we have a secure coding standard"). Under the DAG-TOML framework, these policies are translated into **programmatic invariants** enforced at compile, build, or deploy gates.

### 1.1 Secure Application Development Process (CIS 16.1)
*   **Policy Control:** "Establish and maintain a secure application development process..."
*   **Hidden Technical Requirement:** Paper policies cannot guarantee developers follow the process. This must be technically enforced by:
    1.  Branch protection rules preventing direct pushes to production/main branches.
    2.  Mandatory multi-party cryptographic approvals (signatures) on merge requests.
    3.  Automated build gates that fail if the corresponding `implementation-dag.toml` or `review-readiness.toml` files are missing or incomplete.
*   **DAG-TOML Mapping:** Enforced via `readiness-gate` and `gate-decision`.

### 1.2 Vulnerability Disclosure Intake (CIS 16.2)
*   **Policy Control:** "Establish and maintain a process to accept and address vulnerability reports..."
*   **Hidden Technical Requirement:** Security teams need structured, automated intake to prevent missed disclosures. Enforced by:
    1.  An automated parser verifying the presence and syntax of `/well-known/security.txt` and its PGP public key.
    2.  Automated intake pipelines that parse incoming reports and create cryptographically tracked issues in the registry.
*   **DAG-TOML Mapping:** Evaluated in `spec-contract` and verified in `smoke-validation`.

### 1.3 Vulnerability Root Cause Analysis (CIS 16.3)
*   **Policy Control:** "Perform root cause analysis on vulnerabilities..."
*   **Hidden Technical Requirement:** Standard post-incident reports are rarely linked back to development. Enforced by:
    1.  Tying vulnerability tickets directly to regression tests (`TEST:` units in `traceability`).
    2.  A rule that fails a deployment gate if a known historic vulnerability ID (e.g., CVE) does not resolve to an active test verifying its resolution.
*   **DAG-TOML Mapping:** Verified via `traceability` and `evidence-matrix`.

### 1.4 Severity Rating System (CIS 16.6)
*   **Policy Control:** "Establish and maintain a severity rating system for vulnerabilities..."
*   **Hidden Technical Requirement:** Standardizing severity requires automated pipeline checks. Enforced by:
    1.  Integrating CVSS scorers directly into SAST/DAST and dependency scanning tools.
    2.  A policy check that automatically fails the build if any vulnerability is found with a CVSS score higher than a defined threshold (e.g., 7.0).
*   **DAG-TOML Mapping:** Enforced in `contract-declaration` and verified in `assertion-log-record`.

### 1.5 Service Provider Inventory & Monitoring (CIS 15.1 / 15.6)
*   **Policy Control:** "Establish and maintain an inventory of service providers..." (15.1) and "Monitor service providers for consistency with security requirements..." (15.6)
*   **Hidden Technical Requirement:** Keeping a static list in a spreadsheet leads to stale records. Enforced by:
    1.  An automated registry registry binding (`adapter-registry-binding`) for every active SaaS or third-party service provider API.
    2.  Technical limits (rate-limiting, API key rotations, IP restrictions) that are continuously validated by build-time or runtime checks.
*   **DAG-TOML Mapping:** Defined in `adapter-registry-binding` and validated in `smoke-validation`.

---

## 2. CIS Control 16 & 15 Safeguard Mapping

Below is the structured mapping of critical software and service safeguards:

| Safeguard ID | CIS Control Name & Description | Mapped DAG-TOML Key / Target | Falsifiable Verification Criterion |
| :--- | :--- | :--- | :--- |
| **CIS-16.1** | **Secure Dev Process:** Establish secure application development process across lifecycles. | `readiness-gate` / `gate-decision` | Fails gate if build-time signature checks do not contain multi-party cryptographic approval. |
| **CIS-16.2** | **Vulnerability Intake:** Accept, track, and address vulnerability reports from external sources. | `smoke-validation` / `security.txt` | Verifies PGP signatures and parses `security.txt` to ensure active reporting endpoint exists. |
| **CIS-16.3** | **Root Cause Analysis:** Perform root cause analysis on vulnerabilities to update dev rules. | `traceability` / `[[tests]]` | Vulnerability IDs must map directly to regression tests to prevent regressions. |
| **CIS-16.4** | **SBOM Inventory:** Maintain inventory of third-party software components (SBOM). | `traceability` / `[[code]]` | SBOM file must exist and its SHA-256 hash must be bound to the release closure root. |
| **CIS-16.5** | **Trusted Components:** Use up-to-date and trusted third-party software components. | `smoke-validation` / `check-dependencies` | Fails build if dependency scanner output contains deprecated or revoked library versions. |
| **CIS-16.6** | **Severity Rating:** Maintain severity rating system for found vulnerabilities. | `assertion-log-record` / `outcome` | Integrates CVSS score scanner to block releases exceeding the severity policy. |
| **CIS-16.7** | **Hardening Configuration Templates:** Use standard hardening configuration templates for application infrastructure. | `implementation-dag` / `closure_root` | Build fails if application-infrastructure config does not match a pinned, hardened template hash. |
| **CIS-16.8** | **Production / Non-Production Separation:** Separate production and non-production systems. | `spec-contract` / `[contract]` | Asserts prod/non-prod boundary invariants; fails if non-production credentials or data cross into production. |
| **CIS-16.9** | **Developer Security Training:** Train developers in application security concepts and secure coding. | `evidence-matrix` / `evidence` | Every authorized committer must map to a current, dated secure-coding training assertion. |
| **CIS-16.10** | **Secure Design Principles:** Apply secure design principles in application architectures. | `spec-contract` / `[contract]` | Asserts specific architectural invariants (e.g., boundary/isolation rules) which are validated statically. |
| **CIS-16.11** | **Vetted Modules / Services:** Leverage vetted modules or services for application security components. | `adapter-registry-binding` / `registry_id` | Security components (authn, crypto, session) must resolve to vetted, registry-bound modules. |
| **CIS-16.12** | **Code-Level Security Checks:** Implement code-level security checks. | `smoke-validation` / `check-linter` | Enforces SAST and linter checks in build pipelines with zero tolerated policy violations. |
| **CIS-16.13** | **Application Penetration Testing:** Conduct application penetration testing. | `evidence-matrix` / `evidence` | Check for active DAST/penetration-test report signatures dated within the compliance window. |
| **CIS-16.14** | **Threat Modeling:** Conduct threat modeling. | `threat-model` / `[[threats]]` | Requires presence of threat-model mapping system architectures to specific test mitigations. |
| **CIS-15.1** | **Service Inventory:** Maintain an inventory of third-party service providers. | `adapter-registry-binding` / `bindings` | Service APIs must register active endpoint bindings with valid credentials and certificates. |
| **CIS-15.3** | **Classify Service Providers:** Classify service providers by risk and data sensitivity. | `spec-contract` / `[contract]` | Each service-provider record must carry a risk-based classification tier; high-sensitivity tiers trigger stricter contract (15.4) and assessment (15.5) requirements. |
