export interface RiotResponseItem {
  id:number,
  name:string,
  description: string,
  active: boolean,
  inStore: boolean,
  to: any[],
  categories: string[],
  maxStacks: number,
  requiredChampion:string,
  requiredAlly:string,
  requiredBuffCurrencyName:string,
  requiredBuffCurrencyCost:number,
  specialRecipe:number,
  isEnchantment:boolean,
  price:number,
  priceTotal:number,
  iconPath:string
}