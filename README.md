opgg sample site

## Improvements

### items, spells 가져오는 로직 개선
- 기존에는 10명의 participant 데이터를 반복할 때 DB에서 가져옴
- 개선 후 match에서 사용 된 모든 items, spells 를 한번에 DB에서 가져온 후 사용 하도록 로직 변경
- items, spells DB 호출 횟수 20:1match => 2:1match

```js
const matches = await Promise.all(
      matchIds.map(async id => {
        const res: Match = (await asiaRiotClient.get(`/lol/match/v5/matches/${id}`)).data

        const { participants } = res.info

        const playerMatchDatas = await Promise.all(
          participants.map(async participant => {
            const { item0, item1, item2, item3, item4, item5, item6, perks, summoner1Id, summoner2Id } = participant

            const itemIds = [item0, item1, item2, item3, item4, item5, item6]
            const items = await getItems(itemIds)

            const spellIds = [summoner1Id, summoner2Id]
            const spells = await getSummonerSpellIcons(spellIds)

            ...
          })
        )
      })
    )
```

```js
const matches = await Promise.all(
      matchIds.map(async id => {
        const res: Match = (await asiaRiotClient.get(`/lol/match/v5/matches/${id}`)).data

        const { participants } = res.info

        const allMatchItemIds: number[] = []
        const allMatchSpellIds: number[] = []

        participants.forEach(el =>
          allMatchItemIds.push(el.item0, el.item1, el.item2, el.item3, el.item4, el.item5, el.item6)
        )
        participants.forEach(el => allMatchSpellIds.push(el.summoner1Id, el.summoner2Id))

        const uniqeItemIds = [...new Set(allMatchItemIds)]
        const uniqeSpellIds = [...new Set(allMatchSpellIds)]

        const allMatchItems = await getItems(uniqeItemIds)
        const allMatchSpells = await getSummonerSpellIcons(uniqeSpellIds)

        const playerMatchDatas = await Promise.all(
          participants.map(async participant => {
            const { item0, item1, item2, item3, item4, item5, item6, perks, summoner1Id, summoner2Id } = participant

            const itemIds = [item0, item1, item2, item3, item4, item5, item6]
            const items = itemIds.map(itemId => allMatchItems.find(item => item.item_id === itemId))

            const spellIds = [summoner1Id, summoner2Id]
            const spells = spellIds.map(spellId => allMatchSpells.find(spell => spell.
            spell_id === spellId))

            ...
          })
        )
      })
    )
```