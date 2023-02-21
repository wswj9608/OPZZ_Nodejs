export const insertItems = 'INSERT INTO item_info (item_id, name, icon_name, description, total_gold) VALUES ?'

export const selectItems =
  'SELECT distinct(item_id), name, icon_name, description, total_gold FROM item_info WHERE item_id in ?'

export const selectSpells = 'SELECT image_url,spell_id,file_name FROM spell_icon WHERE spell_id in ?'
