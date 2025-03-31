import styles from "./emergency-contact.module.css";

export default function EmergencyContact() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Emergency Contacts</h1>
      <p className={styles.description}>
        In case of an emergency, please reach out to the relevant services listed below:
      </p>
      <div className={styles.contactList}>
        <div className={styles.contactItem}>
          <span className={styles.emoji}>🚑</span>
          <div>
            <h2>Ambulance</h2>
            <p>For immediate medical assistance, call <strong>911 (India)</strong>.</p>
          </div>
        </div>
        <div className={styles.contactItem}>
          <span className={styles.emoji}>🏥</span>
          <div>
            <h2>Hospital Helpline</h2>
            <p>Nearest hospital support: <strong>+91 8005551234</strong>.</p>
          </div>
        </div>
        <div className={styles.contactItem}>
          <span className={styles.emoji}>🆘</span>
          <div>
            <h2>Mental Health Support</h2>
            <p>24/7 confidential support: <strong>+91 8002738255</strong>.</p>
          </div>
        </div>
        <div className={styles.contactItem}>
          <span className={styles.emoji}>👮</span>
          <div>
            <h2>Police</h2>
            <p>For law enforcement, call <strong>100 (India)</strong>.</p>
          </div>
        </div>
        <div className={styles.contactItem}>
          <span className={styles.emoji}>🔥</span>
          <div>
            <h2>Fire Department</h2>
            <p>For fire emergencies, call <strong>101 (India)</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
