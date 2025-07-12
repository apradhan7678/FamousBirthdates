"use client";

import { WikimediaPerson } from "@/utils/wikimediaApi";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import styles from "./FamousPersonCard.module.css";

interface FamousPersonCardProps {
  person: WikimediaPerson;
  className?: string;
}

export default function FamousPersonCard({
  person,
  className,
}: FamousPersonCardProps) {
  return (
    <CardContainer className={`${styles.card} ${className || ""}`}>
      <CardBody className={styles.cardBody}>
        <CardItem className={styles.header}>
          <div className={styles.nameSection}>
            <h3 className={styles.name}>{person.name}</h3>
            <span className={styles.profession}>{person.profession}</span>
          </div>
          <div className={styles.year}>{person.birthYear}</div>
        </CardItem>

        {person.imageUrl && (
          <CardItem className={styles.imageContainer} translateZ={20}>
            <img
              src={person.imageUrl}
              alt={person.name}
              className={styles.personImage}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </CardItem>
        )}

        <CardItem className={styles.content} translateZ={10}>
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

          {person.wikipediaUrl && (
            <div className={styles.wikipediaLink}>
              <a
                href={person.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.wikiButton}
              >
                Read More on Wikipedia
              </a>
            </div>
          )}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
