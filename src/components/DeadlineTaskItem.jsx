function DeadlineTaskItem({ title, datum }) {
  return (
    <div className="task_item">
      <div className="checkbox-wrapper-31">
        <input type="checkbox" />
        <svg viewBox="0 0 35.6 35.6">
          <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
          <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
          <polyline
            className="check"
            points="11.78 18.12 15.55 22.23 25.17 12.87"
          ></polyline>
        </svg>
      </div>
      <div className="deadline_container">
        <div className="task_title">{title}</div>
        <div className="datum">{datum}</div>
      </div>
    </div>
  );
}

export default DeadlineTaskItem;

// /* Tamamlandığında güzel efekt (bunu beğendiğin için koruyoruz) */
// .task_item:has(input[type="checkbox"]:checked) .deadline_container {
//   opacity: 0.6; /* hafif soluk */
//   border: 1px solid #e67e08; /* turuncu bir çizgi */
//   border-radius: 8px;
//   padding: 2px 8px; /* biraz iç boşluk */
//   background-color: #f0e5e5; /* hafif pembe/soluk kırmızı – tamamlanmış hissi verir */
// }
