import React from "react";

function MobileNotSupported() {
  return (
    <main className="mobile-view">
      <div className="min-h-screen flex">
        <div className="text-2xl text-center m-auto">
          <h3 className="text-4xl font-bold mb-[10px]">DYAD</h3>
          <div>Sorry, we do not support a mobile version</div>
        </div>
      </div>
    </main>
  );
}

export default MobileNotSupported;
