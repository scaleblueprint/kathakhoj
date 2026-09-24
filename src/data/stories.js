// Original English demonstration fiction. These are not translations or regional classics.
// Publish source-backed regional works only after complete original and reviewed translation are ready.
const demo = [
  {
    id:'last-lantern', title:'The Last Lantern', subtitle:'A light kept alive for reasons no one quite understood',
    region:'Karnataka', language:'English', inspiredLanguage:'Original English', originalLanguage:'English',
    originalLocale:'en-IN', genre:'short-story', theme:'Memory & belonging', duration:'Original short story · 4 parts',
    type:'Original English demonstration story', accent:'amber',
    summary:'Meera keeps her late father’s lantern outside her tea shop. When a storm darkens the town, its light guides a lost traveller to safety and gives an old memory a new purpose.',
    essence:'An object that begins as a private memory can become an act of welcome.',
    note:'Original English fiction written for this prototype. This is not a Kannada literary work or a translation.',
    rights:{original:'original-demo'}, translator:'Not applicable — original English',
    parts:[
      {title:'The light outside',original:[
        'Meera lit the lantern each evening before she turned the sign on her tea shop to OPEN. Its glass was cloudy, its handle bent, and its brass frame had darkened with age. Across the road, the new bus shelter glowed with electric lights. The lantern was no longer needed, at least not for seeing the way.',
        'Her brother Arun said so whenever he visited. “You spend more time cleaning that thing than the tables,” he teased. Meera would smile and pour his tea. Their father had carried the lantern on the old road home, before the bridge and the streetlights arrived. Keeping it burning felt like leaving a place for him at the shop.',
        'The customers knew the ritual. Some barely noticed it; others glanced at the small flame before stepping in out of the evening rain. Meera had never thought to ask what they saw in it.'
      ],english:[]},
      {title:'When the town went dark',original:[
        'The storm came earlier than the weather report had promised. Rain hammered the tin awning, the power blinked twice, and the entire square went dark. From the tea shop, Meera could make out only the pale road and the lantern at the door.',
        'She pulled the shutters halfway down but left the light outside. There was still hot water in the kettle and enough tea for anyone caught in the rain. The buses had stopped running. A few people hurried past, holding bags over their heads.',
        'Then someone knocked. A young traveller stood on the step with a soaked backpack and a phone that had run out of charge. He had taken the wrong road from the station and could not read the signs. “I saw your light,” he said, embarrassed to be asking for help.'
      ],english:[]},
      {title:'A map on a paper bag',original:[
        'Meera gave him a towel and a glass of tea. She drew the route to the bus stand on the back of a paper bag, marking the temple, the bakery and the narrow lane that would stay above the floodwater. Arun arrived while she was explaining the last turn.',
        '“He cannot go now,” Arun said, looking at the road. So they waited together. The traveller told them about the grandmother he was visiting. Meera told him how her father used to judge the weather by the smell of the soil. Arun, who usually had little patience for such stories, listened without interrupting.',
        'When the rain eased, Arun walked the traveller as far as the bakery. Meera watched their shapes disappear beyond the lantern’s small circle of light.'
      ],english:[]},
      {title:'What the lantern meant',original:[
        'The next morning the electricity returned and the buses began to run. Meera found a folded note beneath the empty tea glass: “Thank you for leaving the light on.” She set it beside the till, unsure why those few words moved her so much.',
        'That afternoon Arun brought a new wick and straightened the lantern’s handle. “It should be easier to carry,” he said. Meera looked at him, then at the road beyond the shop. She had kept the lantern because it reminded her of someone who had once found his way home. Now it had helped someone else find theirs.',
        'At dusk she lit it again. The flame was the same, but the reason for keeping it had grown.'
      ],english:[]}
    ]
  },
  {
    id:'river-letter',title:'A Letter for the River',subtitle:'An unsent message that outlives its writer',
    region:'Kerala',language:'English',inspiredLanguage:'Original English',originalLanguage:'English',originalLocale:'en-IN',
    genre:'short-story',theme:'Place & family',duration:'Original short story · 4 parts',type:'Original English demonstration story',accent:'green',
    summary:'Anu discovers a letter her grandfather addressed to the river beside the family home. Reading it with her grandmother helps her see how places hold memories across generations.',
    essence:'A place can change and still carry the stories of the people who lived beside it.',
    note:'Original English fiction written for this prototype. This is not a Malayalam literary work or a translation.',
    rights:{original:'original-demo'},translator:'Not applicable — original English',
    parts:[
      {title:'The old cupboard',original:[
        'Every summer Anu returned to her grandmother’s house beside the river. She knew the cool red floor, the mango tree that leaned over the wall, and the cupboard whose doors stuck during the rains.',
        'One afternoon, looking for an old board game, she found an envelope tied with blue thread. It carried no address except two words: To the river. The handwriting was her grandfather’s. He had died before Anu was old enough to remember his voice.',
        'Her grandmother turned the envelope over gently. “He wrote that during the year they built the new embankment,” she said. “You may read it.”'
      ],english:[]},
      {title:'A letter without a postbox',original:[
        'The letter thanked the river for carrying fishing boats, fallen leaves and the reflection of the first lamp lit at home. It remembered children racing along a muddy path, women talking at the steps and the sound of rain on the old ferry roof.',
        'Then its tone changed. The new wall had made the banks safer, her grandfather wrote, but the path he had walked since childhood was gone. He wondered whether a river remembered a road after people stopped using it.',
        'Anu read the question twice. She had always known the concrete steps and the bridge. She had never imagined that the riverbank had once looked different.'
      ],english:[]},
      {title:'The other bank',original:[
        'Her grandmother took her outside and pointed across the water. “There used to be a landing there,” she said. “Your grandfather waited for the ferry every morning.” She described a tea seller, a banyan tree and a bell that rang when the boat was ready.',
        'They walked to the new bridge. From its middle Anu could see the house roof through the palms. The river looked ordinary, but the places her grandmother named seemed to appear around it for a moment.',
        '“Why didn’t he send the letter anywhere?” Anu asked. Her grandmother laughed softly. “Perhaps writing it was enough.”'
      ],english:[]},
      {title:'A new page',original:[
        'Before leaving, Anu put the letter back in its envelope. Then she found a clean sheet of paper and added a page of her own. She wrote about the bridge, the school bus, the children who still gathered by the water and the new trees planted along the bank.',
        'She did not try to make her words sound like her grandfather’s. She only wanted someone, years from now, to know what the river looked like to her.',
        'Her grandmother tied the pages together with the blue thread. The cupboard door closed with its familiar stubborn click, and outside the river went on moving.'
      ],english:[]}
    ]
  }
]
export const demoStories = demo

const bilingualStories = [{
  id:'the-blue-door', title:'ನೀಲಿ ಬಾಗಿಲು · The Blue Door',
  subtitle:'A forgotten room and the stories a street remembers',
  region:'Karnataka', language:'Kannada', inspiredLanguage:'Kannada · original bilingual fiction',
  originalLanguage:'Kannada', originalLocale:'kn-IN', genre:'short-story',
  theme:'Memory & belonging', duration:'4 chapters · complete short story',
  type:'Newly written bilingual short story', accent:'green',
  author:'KathaKhoj editorial fiction', translator:'KathaKhoj English rendering',
  note:'Newly written Kannada-and-English fiction for KathaKhoj. Not attributed to a historical author or presented as a published classic.',
  rights:{original:'original-editorial',english:'original-editorial'},
  summary:{
    original:'ಹಳೆಯ ಬೀದಿಯ ನೀಲಿ ಬಾಗಿಲಿನ ಹಿಂದೆ ಏನಿದೆ ಎಂದು ತಿಳಿಯಲು ಬಂದ ನಂದಿನಿಗೆ, ಅದು ಕೇವಲ ಮುಚ್ಚಿದ ಕೊಠಡಿಯಲ್ಲ, ನೆರೆಹೊರೆಯವರ ನೆನಪುಗಳನ್ನು ಉಳಿಸಿಕೊಂಡಿರುವ ಜಾಗ ಎಂಬುದು ಗೊತ್ತಾಗುತ್ತದೆ. ಎಲ್ಲರೂ ಸೇರಿ ಅದನ್ನು ಮತ್ತೆ ತೆರೆದಾಗ, ಆ ಬೀದಿಗೆ ಹೊಸ ಭೇಟಿಯ ಸ್ಥಳ ಸಿಗುತ್ತದೆ.',
    english:'When Nandini returns to an old street, she discovers that the room behind a blue door holds more than abandoned furniture: it holds the neighbourhood’s shared memories. Opening it together gives the street a new gathering place.'
  },
  essence:'A shared place survives when people choose to care for it together.',
  parts:[
    {title:'The key / ಕೀಲಿ',
      original:[
        'ನಂದಿನಿ ಹನ್ನೆರಡು ವರ್ಷಗಳ ನಂತರ ಅಜ್ಜಿಯ ಮನೆಗೆ ಮರಳಿದಾಗ, ಬೀದಿಯ ಕೊನೆಯಲ್ಲಿದ್ದ ನೀಲಿ ಬಾಗಿಲು ಇನ್ನೂ ಹಾಗೆಯೇ ಇತ್ತು. ಅದರ ಬಣ್ಣ ಉದುರಿತ್ತು; ಬೀಗದ ಸುತ್ತ ಮಣ್ಣು ಜಮೆಯಾಗಿತ್ತು. ಆದರೆ ಬಾಗಿಲಿನ ಮೇಲಿನ ಚಿಕ್ಕ ಗಾಜಿನ ಕಿಟಕಿಯಲ್ಲಿ ಸಂಜೆಯ ಬೆಳಕು ಹಿಂದಿನಂತೆಯೇ ಮಿನುಗುತ್ತಿತ್ತು.',
        'ಅಜ್ಜಿಯ ಮನೆಯ ಕಪಾಟಿನಲ್ಲಿ ಹಳೆಯ ಕೀಲಿಗಳ ಗುಚ್ಛ ಸಿಕ್ಕಿತು. ಒಂದು ಕೀಲಿಗೆ ನೀಲಿ ದಾರ ಕಟ್ಟಲಾಗಿತ್ತು. “ಅದು ಬೀದಿಯ ಓದುವ ಕೊಠಡಿಯ ಕೀಲಿ,” ಎಂದು ಅಜ್ಜಿ ಹೇಳಿದರು. “ಒಂದು ಕಾಲದಲ್ಲಿ ಎಲ್ಲರೂ ಅಲ್ಲಿ ಸೇರುತ್ತಿದ್ದರು. ನಂತರ ಒಬ್ಬೊಬ್ಬರಾಗಿ ಬೇರೆಡೆಗೆ ಹೋದರು. ಕೊಠಡಿ ಮುಚ್ಚಿಹೋಯಿತು.”',
        '“ಅದನ್ನು ಮತ್ತೆ ತೆರೆಯಬಹುದೇ?” ಎಂದು ನಂದಿನಿ ಕೇಳಿದಳು. ಅಜ್ಜಿ ಕೀಲಿಯನ್ನು ಅವಳ ಕೈಗೆ ಕೊಟ್ಟರು. “ಬಾಗಿಲು ತೆರೆಯುವುದು ಸುಲಭ. ಅದನ್ನು ತೆರೆದಿಟ್ಟುಕೊಳ್ಳಲು ಜನ ಬೇಕು.”'
      ],
      english:[
        'When Nandini returned to her grandmother’s house after twelve years, the blue door at the end of the street was still there. Its paint had peeled and dust had gathered around the lock. Yet the small glass pane above it caught the evening light just as she remembered.',
        'In her grandmother’s cupboard she found a ring of old keys. One had a blue thread tied to it. “That belongs to the street’s reading room,” Grandmother said. “Everyone used to gather there. Then people moved away, one by one, and the room was shut.”',
        '“Could we open it again?” Nandini asked. Grandmother placed the key in her palm. “Opening a door is easy. Keeping it open takes people.”'
      ]},
    {title:'Inside / ಒಳಗೆ',
      original:[
        'ಮರುದಿನ ಬೆಳಿಗ್ಗೆ ನಂದಿನಿ ಬಾಗಿಲಿನ ಮುಂದೆ ನಿಂತಳು. ಕೀಲಿ ಮೊದಲು ತಿರುಗಲಿಲ್ಲ. ಅವಳು ನಿಧಾನವಾಗಿ ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿದಾಗ ಬೀಗ ಸಡಿಲವಾಯಿತು. ಬಾಗಿಲು ತೆರೆದೊಡನೆ ಹಳೆಯ ಕಾಗದದ ವಾಸನೆ ಹೊರಬಂತು.',
        'ಒಳಗೆ ಎರಡು ಉದ್ದದ ಬೆಂಚುಗಳು, ಒಂದು ಮೇಜು, ಗೋಡೆಯ ಮೇಲೆ ನಿಂತ ಗಡಿಯಾರ ಮತ್ತು ಪುಸ್ತಕಗಳ ಕಪಾಟು ಇತ್ತು. ಕಿಟಕಿಯ ಬಳಿ ಮಕ್ಕಳ ಎತ್ತರವನ್ನು ಗುರುತಿಸಿದ ಪೆನ್ಸಿಲ್ ಗೆರೆಗಳು ಕಾಣುತ್ತಿದ್ದವು. ಒಂದು ಗೆರೆಯ ಪಕ್ಕದಲ್ಲಿ ಅವಳದೇ ಹೆಸರು ಬರೆದಿತ್ತು. ಆ ದಿನ ಅವಳು ಇಲ್ಲಿ ಕಳೆದ ಮಧ್ಯಾಹ್ನಗಳು ನೆನಪಾದವು.',
        'ಮೇಜಿನ ಮೇಲೆ ಒಂದು ದಪ್ಪ ನೋಟ್‌ಪುಸ್ತಕ ಇತ್ತು. ಮೊದಲ ಪುಟದಲ್ಲಿ “ನಮ್ಮ ಬೀದಿಯ ಕಥೆಗಳು” ಎಂದು ಬರೆಯಲಾಗಿತ್ತು. ಅದರೊಳಗೆ ಯಾರೋ ಮೊದಲ ಮಳೆಯ ದಿನವನ್ನು, ಮತ್ತೊಬ್ಬರು ಕಳೆದುಹೋದ ಬೆಕ್ಕನ್ನು, ಇನ್ನೊಬ್ಬರು ಎಲ್ಲರಿಗೂ ಊಟ ಮಾಡಿದ ಹಬ್ಬವನ್ನು ದಾಖಲಿಸಿದ್ದರು. ಕೊನೆಯ ಪುಟ ಮಾತ್ರ ಖಾಲಿಯಾಗಿತ್ತು.'
      ],
      english:[
        'The next morning Nandini stood before the door. The key would not turn at first. She tried again, gently, and the lock gave way. The smell of old paper drifted out as the door opened.',
        'Inside were two long benches, a table, a stopped wall clock and a cupboard of books. Pencil marks beside the window recorded children’s heights. Her own name stood beside one of them. She remembered the afternoons she had spent here.',
        'A thick notebook lay on the table. Its first page read “Stories of Our Street.” Someone had recorded the first rain of a season, another a lost cat, and another a festival when everyone had cooked together. Only the last page was blank.'
      ]},
    {title:'The invitation / ಆಹ್ವಾನ',
      original:[
        'ನಂದಿನಿ ಕೊಠಡಿಯನ್ನು ಒಬ್ಬಳೇ ಸ್ವಚ್ಛಗೊಳಿಸಲು ಆರಂಭಿಸಿದಳು. ಸ್ವಲ್ಪ ಹೊತ್ತಿನಲ್ಲಿ ಎದುರಿನ ಮನೆಯ ರಹೀಂ ಅಂಕಲ್ ಪೊರಕೆ ಹಿಡಿದು ಬಂದರು. ನಂತರ ಶಾಲೆಯಿಂದ ಹಿಂದಿರುಗಿದ ಇಬ್ಬರು ಮಕ್ಕಳು ಪುಸ್ತಕಗಳನ್ನು ಒರೆಸಲು ಸಹಾಯ ಮಾಡಿದರು. ಮಧ್ಯಾಹ್ನದ ವೇಳೆಗೆ ಕಿಟಕಿಗಳು ತೆರೆದಿದ್ದವು; ಗಾಳಿಯಲ್ಲಿ ಧೂಳಿನ ಬದಲು ಹೊಸ ಚಹಾದ ಪರಿಮಳ ಹರಡಿತ್ತು.',
        '“ಇದು ನನ್ನ ತಂದೆಯ ಮೆಚ್ಚಿನ ಜಾಗ,” ಎಂದು ರಹೀಂ ಅಂಕಲ್ ಹೇಳಿದರು. “ಅವರು ಪತ್ರಿಕೆ ಓದಿ ಎಲ್ಲರಿಗೂ ಸುದ್ದಿ ಹೇಳುತ್ತಿದ್ದರು.” ಮಕ್ಕಳು ನೋಟ್‌ಪುಸ್ತಕವನ್ನು ನೋಡಲು ಕೇಳಿದರು. ನಂದಿನಿ ಅದನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ತೆರೆದು ಪ್ರತಿಯೊಂದು ಕಥೆಯನ್ನೂ ಓದಿ ಕೇಳಿಸಿದಳು.',
        'ಅವರು ಮುಂದಿನ ಭಾನುವಾರ ಎಲ್ಲರನ್ನೂ ಆಹ್ವಾನಿಸಲು ತೀರ್ಮಾನಿಸಿದರು. ನಂದಿನಿ ಕಾಗದದ ಮೇಲೆ ಬರೆದಳು: “ನೀಲಿ ಬಾಗಿಲು ಮತ್ತೆ ತೆರೆದಿದೆ. ನಿಮ್ಮ ಕಥೆಯನ್ನೂ ತೆಗೆದುಕೊಂಡು ಬನ್ನಿ.” ಆ ಆಹ್ವಾನವನ್ನು ಬೀದಿಯ ಪ್ರತಿಯೊಂದು ಮನೆಯ ಬಾಗಿಲಿಗೆ ಅಂಟಿಸಿದರು.'
      ],
      english:[
        'Nandini began cleaning the room alone. Soon Rahim Uncle from across the street arrived with a broom. Two children returning from school helped wipe the books. By afternoon the windows were open, and the smell of fresh tea had replaced the dust.',
        '“This was my father’s favourite place,” Rahim Uncle said. “He read the newspaper here and told everyone the news.” The children asked to see the notebook. Nandini opened it carefully and read the stories aloud.',
        'They decided to invite everyone the following Sunday. Nandini wrote on a sheet of paper: “The blue door is open again. Bring your story.” They pinned the invitation to every house on the street.'
      ]},
    {title:'A new page / ಹೊಸ ಪುಟ',
      original:[
        'ಭಾನುವಾರ ಸಂಜೆ ಕೊಠಡಿ ತುಂಬಿತು. ಯಾರೋ ಹಳೆಯ ಛಾಯಾಚಿತ್ರ ತಂದರು. ಮತ್ತೊಬ್ಬರು ಪುಸ್ತಕಗಳ ಚೀಲ ತಂದರು. ಮಕ್ಕಳು ಕಿಟಕಿಯ ಬಳಿ ಕುಳಿತು ತಮ್ಮ ಹೊಸ ಕಥೆಗಳನ್ನು ಬರೆಯಲು ಆರಂಭಿಸಿದರು. ಅಜ್ಜಿ ಬಾಗಿಲಿನ ಹತ್ತಿರ ಕುಳಿತು ಎಲ್ಲರ ಮಾತನ್ನೂ ಕೇಳುತ್ತಿದ್ದರು.',
        'ನಂದಿನಿ ನೋಟ್‌ಪುಸ್ತಕದ ಖಾಲಿ ಪುಟವನ್ನು ತೆರೆದಳು. “ಇಂದಿನ ದಿನದ ಬಗ್ಗೆ ಯಾರು ಬರೆಯುತ್ತಾರೆ?” ಎಂದು ಕೇಳಿದಳು. ಒಬ್ಬ ಪುಟ್ಟ ಹುಡುಗಿ ಕೈ ಎತ್ತಿದಳು. ಅವಳು ಬರೆದ ಮೊದಲ ವಾಕ್ಯ ಹೀಗಿತ್ತು: “ನಾವು ಒಂದು ಹಳೆಯ ಬಾಗಿಲನ್ನು ತೆರೆದಾಗ, ನಮ್ಮ ಬೀದಿ ಮತ್ತೆ ಒಂದಾಯಿತು.”',
        'ರಾತ್ರಿ ಎಲ್ಲರೂ ಮನೆಗೆ ಹೊರಟಾಗ ನಂದಿನಿ ದೀಪ ಆರಿಸಲು ಕೈ ಚಾಚಿದಳು. “ನಾಳೆ ಶಾಲೆಯ ನಂತರ ಬರಬಹುದೇ?” ಎಂದು ಮಕ್ಕಳು ಕೇಳಿದರು. ಅವಳು ನಗುತ್ತಾ ದೀಪವನ್ನು ಬೆಳಗಿಯೇ ಬಿಟ್ಟಳು. ನೀಲಿ ಬಾಗಿಲು ಇನ್ನು ನೆನಪಿನ ಬಾಗಿಲು ಮಾತ್ರವಾಗಿರಲಿಲ್ಲ; ಅದು ನಾಳೆಯ ಬಾಗಿಲಾಗಿತ್ತು.'
      ],
      english:[
        'On Sunday evening the room filled up. Someone brought an old photograph; someone else brought a bag of books. The children sat by the window and began writing new stories. Grandmother sat near the door, listening to everyone.',
        'Nandini opened the notebook to its blank page. “Who will write about today?” she asked. A little girl raised her hand. Her first sentence was: “When we opened an old door, our street came together again.”',
        'As everyone left that night, Nandini reached for the light switch. “Can we come back after school tomorrow?” the children asked. She smiled and left the light on. The blue door was no longer only a door to the past. It had become a door to tomorrow.'
      ]}
  ]
}]

export const regionalStories = bilingualStories
export const stories = [...regionalStories, ...demoStories]
export const filters = ['All','Karnataka','Kerala','Memory & belonging','Place & family']
