export default function EndOfGame({ win }: { win: boolean }) {
  return (
    <div className="mt-4 space-y-3">
      {win 
        ?
          <img 
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDc2eDdnbHppMDF5dG12cGNzMjcyZWl3MG84ZnM2eHRuMDJubDk1OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2ICLbTm10MlnHKK1TX/giphy.gif" 
            alt="Happy GIF" 
            style={{ width: '100%', height: 'auto' }} 
          />
        :
          <img 
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnB4bDVxb2UxOXZ4ZnRwZnlweXdpNGZ0dHoweWo1a2pyNHRrM3N4bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CLyRt0NTu1KPCyepfP/giphy.gif" 
            alt="Upset GIF" 
            style={{ width: '100%', height: 'auto' }} 
          />
      }
    </div>
  );
}