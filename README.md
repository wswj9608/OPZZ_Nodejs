# **OP.GG sample production**

- 리그오브레전드 전적 검색 서비스 OP.GG(https://op.gg) 샘플 사이트
- 평소 관심이 많던 서비스여서 next.js, express 사용을 위해 샘플 사이트 개발
  <br>
  <br>

## **Product Url**

https://opzz-react.vercel.app

<br>
<br>

## **Stack**

- **Front-end** : React.js, Next.js, TypeScript, Recoil, Styled-components <br>
- **Back-end** : Express, TypeScript <br>
- **Database** : MYSQL

<br>
<br>

## **구현기능**

- 소환사이름 검색 페이지
  ![searchName](https://images-server-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2023-04-10+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+3.23.31.png)
  
  <br>
  <br>

- 소환사 전적 리스트 페이지
  ![match](https://images-server-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2023-04-10+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+3.22.20.png)

  <br>
  <br>

- 전적 상세내용 표시
  ![matchDetail](https://images-server-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2023-04-10+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+3.22.52.png)

<br>
<br>

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