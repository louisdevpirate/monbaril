// components/ui/OrderIdSkeleton.tsx
export default function OrderIdSkeleton() {
  return (
    <span
      style={{
        display: "inline-block",
        width: "120px",
        height: "1.2em",
        backgroundColor: "#eee",
        borderRadius: "4px",
        animation: "pulse 1.5s infinite",
      }}
    />
  );
}