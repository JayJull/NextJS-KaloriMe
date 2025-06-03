"use client";

import MakananLayout from "../../src/components/dashboard/Makanan";
import { makanan } from "../../src/data/interface";

export default function Makanan() {
  const makananList = makanan;

  return (
    <MakananLayout title="Makanan">

      <div className="p-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {makananList.map((item, index) => (
            <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="text-center mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover mx-auto mb-2 border border-gray-200"
                />
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-2 text-center">{item.name}</h3>

              <div className="flex items-center justify-between">
                <span className="text-orange-600 font-bold">{item.calories} kal</span>
               
              </div>
            </div>
          ))}
        </div>
      </div>
    </MakananLayout>
  );
}
