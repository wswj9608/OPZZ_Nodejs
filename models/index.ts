export const getProfileUrlQuery =
  "SELECT image_url FROM profile_icon WHERE SUBSTRING_INDEX(file_name, '.', 1) = ?"
export const insertProfileIcons = 'INSERT INTO profile_icon SET ?'
export const insertIcons = (table: string) => `INSERT INTO ${table}_icon SET ?`
export const insertItems =
  'INSERT INTO item_info (item_id, name, description, gold_total) VALUES ?'
export const selectItems =
  'SELECT distinct(icon_id), item_icon.item_id, image_url, file_name, name, description, gold_total FROM item_icon join item_info on item_icon.item_id = item_info.item_id WHERE item_icon.item_id IN ?'
