import styles from './Card.module.sass';

export default function Card ({
  image,
  title,
  items = [],
  buttonText,
  onButtonClick,
}) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.imgContainer}>
          <img src={image} alt={title} className={styles.img} />
        </div>

        {items[0] && <div className={styles.absoluteItem}>{items[0]}</div>}

        <div className={styles.infoContainer}>
          <h2 className={styles.name}>{title}</h2>
          <ul className={styles.itemsContainer}>
            {items.slice(1).map((item, index) => (
              <li key={index} className={styles.item}>
                {item}
              </li>
            ))}
          </ul>

          {buttonText && (
            <button className={styles.button} onClick={onButtonClick}>
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
