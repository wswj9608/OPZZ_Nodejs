export const insertItems =
  "INSERT INTO item_info (item_id, name, description, total_gold) VALUES ?";

export const selectItems = "SELECT distinct(item_id),name,description,total_gold FROM item_info WHERE item_id in ?";