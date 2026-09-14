const fs = require('fs');

const idxPath = 'apps/mobile/app/(consumer)/guides/index.tsx';
let idxContent = fs.readFileSync(idxPath, 'utf8');

// Add points_reward to the card render
const pointsUI = `
          {item.points_reward !== undefined && (
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4, backgroundColor: 'rgba(250,204,21,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start'}}>
              <Smile color="#facc15" size={12} />
              <Text style={{fontSize: 12, color: '#facc15', fontWeight: 'bold'}}>{item.points_reward} pts</Text>
            </View>
          )}
`;

idxContent = idxContent.replace(
  `{item.distance !== undefined && (`,
  pointsUI + '\n            {item.distance !== undefined && ('
);

fs.writeFileSync(idxPath, idxContent);
console.log("guides/index.tsx patched!");
