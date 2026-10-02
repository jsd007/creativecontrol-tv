"use client";

import type { ResolvedViewingJourney } from "@/lib/viewingJourneys";
import styles from "./ViewingJourneys.module.css";

type Props = {
  journeys: ResolvedViewingJourney[];
  active?: ResolvedViewingJourney;
  position: number;
  onPick: (id: string) => void;
  onLeave: () => void;
};

export function ViewingJourneys({ journeys, active, position, onPick, onLeave }: Props) {
  if (!journeys.length) return null;

  if (active) {
    return (
      <section className={styles.root} aria-label="Current viewing journey">
        <div className={styles.activeHead}>
          <div>
            <p className={styles.eyebrow}>VIEWING JOURNEY · {position >= 0 ? `${position + 1} OF ${active.clips.length}` : `${active.clips.length} PARTS`}</p>
            <h3 className={styles.title}>{active.title}</h3>
          </div>
          <button type="button" onClick={onLeave} className={styles.leave}>LEAVE JOURNEY ↗</button>
        </div>
        <p className={styles.description}>{active.description}</p>
        <details className={styles.details}>
          <summary>About this sequence / choose another</summary>
          <p>{active.note}</p>
          <label className={styles.selector}>
            <span>CHANGE JOURNEY</span>
            <select value={active.id} onChange={(event) => onPick(event.target.value)}>
              {journeys.map((journey) => <option key={journey.id} value={journey.id}>{journey.title} ({journey.clips.length} parts)</option>)}
            </select>
          </label>
        </details>
      </section>
    );
  }

  return (
    <section className={styles.root} aria-labelledby="viewing-journeys-title">
      <div className={styles.head}>
        <h3 id="viewing-journeys-title" className={styles.eyebrow}>WATCH A SHORT STORY</h3>
        <p>Choose a path to start watching.</p>
      </div>
      <div className={styles.cards}>
        {journeys.map((journey) => (
          <button key={journey.id} type="button" className={styles.card} onClick={() => onPick(journey.id)} aria-label={`Start ${journey.title}, ${journey.clips.length} parts`}>
            <span className={styles.cardLabel}>{journey.label}</span>
            <strong>{journey.title}</strong>
            <span className={styles.cardAction}>{journey.clips.length} PARTS · START →</span>
          </button>
        ))}
      </div>
    </section>
  );
}
