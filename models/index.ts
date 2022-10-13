export const getProfileUrlQuery =
  "SELECT image_url FROM profile_icon WHERE SUBSTRING_INDEX(file_name, '.', 1) = ?"
export const insertProfileIcons = 'INSERT INTO profile_icon SET ?'
export const insertIcons = (table: string) => `INSERT INTO ${table}_icon SET ?`
