import Image from "next/image";

export const WIN_GIF = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDc2eDdnbHppMDF5dG12cGNzMjcyZWl3MG84ZnM2eHRuMDJubDk1OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2ICLbTm10MlnHKK1TX/giphy.gif";
export const LOSE_GIF = "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnB4bDVxb2UxOXZ4ZnRwZnlweXdpNGZ0dHoweWo1a2pyNHRrM3N4bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CLyRt0NTu1KPCyepfP/giphy.gif";

export default function EndOfGame({ win }: { win: boolean }) {
  return (
    <div className="mt-4 space-y-3">
      <Image
        src={win ? WIN_GIF : LOSE_GIF}
        alt={win ? "Happy GIF" : "Upset GIF"}
        width={480}
        height={270}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}