"use client";

import { FamousPerson } from "@/utils/fakeData";
import styles from "./FamousPersonCard.module.css";

interface FamousPersonCardProps {
  person: FamousPerson;
  className?: string;
}

export default function FamousPersonCard({
  person,
  className,
}: FamousPersonCardProps) {
  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.header}>
        <div className={styles.nameSection}>
          <h3 className={styles.name}>{person.name}</h3>
          <span className={styles.profession}>{person.profession}</span>
        </div>
        <div className={styles.year}>{person.birthYear}</div>
      </div>

      <div className={styles.content}>
        <div className={styles.background}>
          <p>{person.background}</p>
        </div>

        <div className={styles.achievements}>
          <h4>Key Achievements:</h4>
          <ul className={styles.achievementsList}>
            {person.achievements.map((achievement, index) => (
              <li key={index} className={styles.achievement}>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
