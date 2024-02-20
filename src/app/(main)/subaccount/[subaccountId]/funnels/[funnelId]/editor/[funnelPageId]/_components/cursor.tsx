import { connectionIdToColor } from "@/lib/utils";

interface CursorProps {
  color: string;
  x: number;
  y: number;
  connectionId: number;
  name: string;
}

export const Cursor = ({ color, x, y, connectionId, name }: CursorProps) => {
  return (
    <>
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translateX(${x}px) translateY(${y}px)`,
        }}
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="z-[9999999]"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
          // className="relative"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translateX(${x + 10}px) translateY(${y + 20}px)`,
          backgroundColor: connectionIdToColor(connectionId),
        }}
        className="z-[99999999] px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
      >
        {name}
      </div>
    </>
  );
};
