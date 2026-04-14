# Security Policy

## 🛡️ Data Handling Procedures

At PhishScale Pro, security and privacy are at the core of our platform. We implement the following protections during every simulation:

### 1. No Credential Storage
- **Protocol**: Any data entered into phishing simulation forms (e.g., the Microsoft 365 clone) is **never saved** to a database or logs. 
- **Validation**: The system only records a `data_submitted: true` flag to track the success of the simulation without compromising user secrets.

### 2. Data Processing
- Sensitive inputs are either:
  - **Immediately discarded** after the submission event is triggered.
  - **Never transmitted** to the backend beyond the initial tracking ping.

### 3. Personal Data Privacy
- Target emails and names are used strictly for sending lures and generating analytics.
- No third-party tracking cookies are used in the simulation landing pages.

---

## ⚖️ Ethical Usage Guidelines

PhishScale Pro is designed strictly for **Cybersecurity Awareness Training**. 

- **Authorization**: Simulations should only be launched by authorized System Administrators or Security Officers.
- **Agreement**: Usage of this platform constitutes an agreement to respect employee privacy and local labor laws regarding security testing.
- **Intent**: The goal of every campaign must be **education**, not punishment.

---

## 🔒 Safety Protections

- **Test Mode**: To prevent accidental mass-mailing, the platform defaults to "Test Mode" for every new user, ensuring emails are only sent to verified administrative addresses during evaluation.
- **Cascading Deletion**: Global "System Reset" and "Target Delete" features allow administrators to instantly remove all simulation data from the environment.

---

## 🚩 Reporting Vulnerabilities
If you discover a security issue within this platform, please report it immediately to your internal Security Operations Center (SOC).
