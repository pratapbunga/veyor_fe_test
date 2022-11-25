import React, { useRef, useMemo, createRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import cn from "classnames";
import Image from "next/image";
import _ from "lodash";

export const Card = ({
  id,
  columnId,
  columnIndex,
  moveCard,
  title,
  isSpacer,
}) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop(
    () => ({
      accept: "CARD",
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      hover(item, monitor) {
        if (!ref.current) {
          return;
        }
        const draggingItem = item;
        if (draggingItem.id !== id) {
          moveCard(draggingItem.id, columnId, columnIndex);
        }
      },
    }),
    [columnId, columnIndex]
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "CARD",
      item: () => {
        return { id, columnId, columnIndex };
      },
      isDragging: (monitor) => {
        return id === monitor.getItem().id;
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, columnId, columnIndex]
  );

  drag(drop(ref));

  return (
    <>
      <div
        role="handle"
        ref={ref}
        className={cn("Card", {
          "opacity-0": isDragging || isSpacer,
        })}
        data-handler-id={handlerId}
      >
        <div className="p-1 flex flex-col">
          <div className="flex flex-row justify-center items-center">
            <Image
              quality="85"
              src="/1mg.png"
              alt={`Ventures ${id}` || "Product Image"}
              height={24}
              width={24}
              layout="fixed"
              className="flex-none w-12 h-12 rounded-lg object-cover bg-gray-100"
            />
            <div className="flex-auto pl-2">
              <h2 className="text-lg font-semibold mb-0.5">Venture {id}</h2>
              <div className="text-sm">Some link</div>
            </div>
          </div>
          <div className="mt-4">Some more lorum ipsum content....</div>
        </div>
      </div>
    </>
  );
};

export const DraggableCard = React.memo(Card);
