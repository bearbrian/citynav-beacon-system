module.exports = {
  defaultData: {
    users: [
      { username: "admin", password: "admin", is_admin: true },
      { username: "admin2", password: "admin2", is_admin: true },
      { username: "admin3", password: "admin3", is_admin: true },
      { username: "user", password: "user", is_admin: false },
      { username: "user2", password: "user2", is_admin: false },
      { username: "user3", password: "user3", is_admin: false },
    ],
    attractions: [
      {
        nameEn: "City University of Hong Kong",
        nameTc: "香港城市大學",
        nameJp: "香港城市大学",
        descriptionEn:
          "City University of Hong Kong is one of Hong Kong's public research universities and comprehensive universities, with its campus located in Sham Shui Po, Kowloon, Hong Kong. Founded in 1984, the school is one of the top universities in Hong Kong.",
        descriptionTc:
          "香港城市大學是香港其中一所公立研究型大學以及綜合大學，校園位於香港九龍深水埗區。該校創立於1984年，是香港頂尖的大學之一。",
        descriptionJp:
          "香港城市大学是香港其中一所公立研究型大学以及综合大学，校园位于香港九龙深水埗区。该大学创立于1984年，是香港顶尖的大學之一。",
        audioEn:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Attraction+1_CityU/Attraction1_CityU_EN.m4a",
        audioTc:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Attraction+1_CityU/Attraction1_CityU_TC.m4a",
        audioJp:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Attraction+1_CityU/Attraction1_CityU_JP.m4a",
        imageUrl:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Attraction+1_CityU/CityU.jpg",
      },
    ],
    beacons: [
      {
        uuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0",
        description: "Beacon for demonstration",
      },
    ],
    spots: [
      {
        nameEn: "Run Run Shaw Library",
        nameTc: "邵逸夫圖書館",
        nameJp: "邵逸夫図書館",
        descriptionEn:
          "The Run Run Shaw Library is the library of City University of Hong Kong. It was established in 1984 and moved to its permanent campus in Kowloon Tong with the university in 1989. In 1990, due to a huge donation from Run Run Shaw to CityU, the library was named Run Run Shaw Library. In addition to the library located on the CityU campus, the library also has a book bank in an industrial building in Shek Mun, Shatin to store some special collections and closed-shelf books.",
        descriptionTc:
          "邵逸夫圖書館為香港城市大學的圖書館，於1984年成立，並於1989年隨大學遷入九龍塘永久校舍。1990年，由於城大獲邵逸夫鉅額捐款，此館遂冠名為為邵逸夫圖書館。 除了位於城大校園的圖書館外，此館亦於沙田石門某工業大廈設立書庫，以存放部分特藏及閉架書籍。",
        descriptionJp:
          "邵逸夫図書館は香港城市大学の図書館で、1984年に設立され、1989年に大学とともに九龍塘の永久校舎に移動しました。1990年、香港城市大学が邵逸夫氏の大額寄付を受け、この館は邵逸夫図書館と命名されました。 城大校園の図書館に加えて、この館は、特殊コレクションと閉架書籍を保管するために、沙田石門の工業建築物に書庫を設立しています。",
        audioEn:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+1_RunRunShawLibrary/Spot1_RunRunShawLibrary_EN.m4a",
        audioTc:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+1_RunRunShawLibrary/Spot1_RunRunShawLibrary_TC.m4a",
        audioJp:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+1_RunRunShawLibrary/Spot1_RunRunShawLibrary_JP.m4a",
        attractionId: 1,
        beaconUuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0",
        beaconMajor: 1,
        beaconMinor: 1,
      },
      {
        nameEn: "Joint Sports Centre",
        nameTc: "聯校運動中心",
        nameJp: "連合運動センター",
        descriptionEn:
          "The Joint University Sports Centre is located at 36 Renfrew Road, Kowloon Tong, Hong Kong, near to the Shaw Campus of Hong Kong Baptist University. It is jointly managed and used by City University of Hong Kong, Hong Kong Baptist University and the Hong Kong Polytechnic University, with daily operations and maintenance being the responsibility of Baptist University.",
        descriptionTc:
          "聯校運動中心位於香港九龍塘聯福道36號，毗鄰香港浸會大學逸夫校園，由香港城市大學、香港浸會大學及香港理工大學共同管理及使用，日常營運和維修由浸會大學負責。",
        descriptionJp:
          "連合運動センターは香港九龍塘連福道36号にあり、香港浸會大学逸夫校園に隣接しています。香港城市大学、香港浸會大学及香港理工大學が共同管理及使用しています。日常運営と保守は浸會大学が責任を持っています。",
        audioEn:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+2_JointSportsCentre/Spot2_JointSportsCentre_EN.m4a",
        audioTc:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+2_JointSportsCentre/Spot2_JointSportsCentre_TC.m4a",
        audioJp:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+2_JointSportsCentre/Spot2_JointSportsCentre_JP.m4a",
        attractionId: 1,
        beaconUuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0",
        beaconMajor: 1,
        beaconMinor: 2,
      },
      {
        nameEn: "The Banga Gallery",
        nameTc: "般哥展覽館",
        nameJp: "般哥展覽館",
        descriptionEn:
          "The Banga Gallery is operated by the university and was established in 2016. The gallery holds two to four exhibitions a year, ranging from one to four months in duration, covering a variety of different themes, but all aim to blend art and technology, and connect Western and Asian art. ",
        descriptionTc:
          "般哥展覽館是由大學營運，成立於2016年。展覽館每年舉辦二至四次為期一至四個月不等的展覽，內容涵蓋多種不同的主題，但都旨在揉合藝術與科技，並連接西方和亞洲藝術。",
        descriptionJp:
          "般哥展覽館は大学が運営しており、2016年に設立されました。展覧会は年に2～4回開催され、期間は1～4ヶ月で、多種多様なトピックをカバーしていますが、すべてがアートとテクノロジーを融合し、西アジアのアートを結びつけることを目的としています。",
        audioEn:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+3_Gallery/Spot3_Gallery_EN.m4a",
        audioTc:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+3_Gallery/Spot3_Gallery_TC.m4a",
        audioJp:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+3_Gallery/Spot3_Gallery_JP.m4a",
        attractionId: 1,
        beaconUuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0",
        beaconMajor: 1,
        beaconMinor: 3,
      },
    ],
    spot_images: [
      {
        spotId: 1,
        imageUrl:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+1_RunRunShawLibrary/library1.jpg",
      },
      {
        spotId: 1,
        imageUrl:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+1_RunRunShawLibrary/library2.jpg",
      },
      {
        spotId: 1,
        imageUrl:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+1_RunRunShawLibrary/library3.jpg",
      },
      {
        spotId: 2,
        imageUrl:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+2_JointSportsCentre/joint1.jpg",
      },
      {
        spotId: 2,
        imageUrl:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+2_JointSportsCentre/joint2.jpg",
      },
      {
        spotId: 2,
        imageUrl:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+2_JointSportsCentre/joint3.jpg",
      },
      {
        spotId: 3,
        imageUrl:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+3_Gallery/gallery1.jpg",
      },
      {
        spotId: 3,
        imageUrl:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+3_Gallery/gallery2.jpeg",
      },
      {
        spotId: 3,
        imageUrl:
          "https://citynav-beacon-system-static.s3.us-east-1.amazonaws.com/Spot+3_Gallery/gallery3.jpeg",
      },
    ],
  },
};
