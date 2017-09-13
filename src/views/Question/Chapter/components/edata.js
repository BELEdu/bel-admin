export default {
  id: 1,
  knowledge: [
    {
      id: 3,
      duration: 15, // 理科时长   integer|between:5,200
      frequency: 5, // 理科频次   integer
      score: 5, // 理科分值   integer|between:0,100
      art_duration: 5, // 文科频次时长   integer|between:5,200
      art_frequency: 5, // 文科频次   integer
      art_score: 5, // 文科频次   integer|between:0,100
      chapter_knowledge_type: 1, // 是否属于本节   boolean
    },
    {
      id: 4,
      duration: 35,
      frequency: 5,
      score: 5,
      art_duration: 5,
      art_frequency: 5,
      art_score: 5,
      chapter_knowledge_type: 0,
    },
    {
      id: 64,
      duration: 35,
      frequency: 25,
      score: 15,
      art_duration: 35,
      art_frequency: 25,
      art_score: 15,
      chapter_knowledge_type: 1,
    },
  ],
}
