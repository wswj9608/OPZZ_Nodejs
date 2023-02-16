import communityDragonClient from "../riot/communityDragonClient";
import { getConnection } from "../../util/mysql";
import { Item } from "./types";
import * as query from "../../models/query";

export const insertItems = async () :Promise<void> => {
  const items = (await communityDragonClient.get<Item[]>("/items.json")).data
    .map((item) => ([item.id, item.name, item.description, item.priceTotal]));
  
  getConnection((conn) => {
    conn.query(query.insertItems, [items], (err, result) => {
      
      if (err) {
        conn.rollback();
      }
      return "update 완료";
    });

    conn.release();
  });
};