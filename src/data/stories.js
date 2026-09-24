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
export const regionalStories = []
export const stories = [...regionalStories, ...demoStories]
export const filters = ['All','Karnataka','Kerala','Memory & belonging','Place & family']
