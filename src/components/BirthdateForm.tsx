"use client";

import { useState } from "react";
import styles from "./BirthdateForm.module.css";

interface BirthdateFormProps {
  onSubmit: (birthdate: Date) => void;
  isLoading?: boolean;
}

export default function BirthdateForm({
  onSubmit,
  isLoading = false,
}: BirthdateFormProps) {
  const [birthdate, setBirthdate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthdate) {
      onSubmit(new Date(birthdate));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && birthdate) {
      onSubmit(new Date(birthdate));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="birthdate" className={styles.label}>
          Enter Your Birthdate
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.input}
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!birthdate || isLoading}
      >
        {isLoading ? "Finding Famous People..." : "Find Famous People"}
      </button>
    </form>
  );
}
