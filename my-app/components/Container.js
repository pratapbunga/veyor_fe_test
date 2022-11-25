import React, { useState } from "react";
import _ from "lodash";
import { Board } from "./Board";

let _columnId = 0;
let _cardId = 0;
const initialCards = Array.from({ length: 9 }).map(() => ({
  id: ++_cardId,
  title: `Card ${_cardId}`,
}));

const initialColumns = ["Target", "Contacted", "First Meeting"].map(
  (title, i) => ({
    id: _columnId++,
    title,
    cardIds: initialCards.slice(i * 3, i * 3 + 3).map((card) => card.id),
  })
);

export default function Container() {
  {
    const [cards, setCards] = useState(initialCards);
    const [columns, setColumns] = useState(initialColumns);

    const addColumn = (_title) => {
      const title = _title.trim();
      if (!title) return;
      const newColumn = {
        id: ++_columnId,
        title,
        cardIds: [],
      };
      setColumns((cols) => [...cols, newColumn]);
    };

    const addCard = (columnId, _title) => {
      const title = _title.trim();
      if (!title) return;

      const newCard = { id: ++_cardId, title };
      setCards((cards) => [...cards, newCard]);
      setColumns((cols) =>
        cols.map((column) =>
          column.id === columnId
            ? { ...column, cardIds: [...column.cardIds, newCard.id] }
            : column
        )
      );
    };

    const moveCard = (cardId, destColumnId, index) => {
      setColumns((cols) =>
        cols.map((column) => ({
          ...column,
          cardIds: _.flowRight(
            // 2) If this is the destination column, insert the cardId.
            (ids) =>
              column.id === destColumnId
                ? [...ids.slice(0, index), cardId, ...ids.slice(index)]
                : ids,
            // 1) Remove the cardId for all columns
            (ids) => ids.filter((id) => id !== cardId)
          )(column.cardIds),
        }))
      );
    };

    return (
      <div>
        <Board
          cards={cards}
          columns={columns}
          moveCard={moveCard}
          addCard={addCard}
          addColumn={addColumn}
        />
      </div>
    );
  }
}
