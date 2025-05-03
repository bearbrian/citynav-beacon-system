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
        nameEn: "Victoria Peak",
        nameTc: "太平山頂",
        descriptionEn:
          "The highest point on Hong Kong Island with stunning city views.",
        descriptionTc: "香港島最高點，享有壯麗的城市景觀。",
        audioEn: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/1.mp3",
        audioTc: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/1.mp3",
        imageUrl: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/11.jpg",
      },
      {
        nameEn: "Lantau Island",
        nameTc: "大嶼山",
        descriptionEn: "Home to the Tian Tan Buddha and scenic hiking trails.",
        descriptionTc: "天壇大佛和風景優美的遠足徑所在地。",
        audioEn: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/2.mp3",
        audioTc: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/2.mp3",
        imageUrl: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/21.jpeg",
      },
    ],
    beacons: [
      {
        uuid: "123e4567-e89b-12d3-a456-426614174000",
        description: "Beacon at Peak Tower entrance",
      },
      {
        uuid: "223e4567-e89b-12d3-a456-426614174001",
        description: "Beacon near Tian Tan Buddha statue",
      },
    ],
    spots: [
      {
        nameEn: "Peak Tower",
        nameTc: "凌霄閣",
        descriptionEn: "A viewing platform with 360-degree views of Hong Kong.",
        descriptionTc: "提供香港360度景觀的觀景台。",
        audioEn: "peak_tower_en.mp3",
        audioTc: "peak_tower_tc.mp3",
        attractionId: 1,
        beaconUuid: "123e4567-e89b-12d3-a456-426614174000",
        beaconMajor: 1,
        beaconMinor: 100,
      },
      {
        nameEn: "Tian Tan Buddha",
        nameTc: "天壇大佛",
        descriptionEn: "A large bronze statue of Buddha, a major landmark.",
        descriptionTc: "大型青銅佛像，是主要地標。",
        audioEn: "tian_tan_buddha_en.mp3",
        audioTc: "tian_tan_buddha_tc.mp3",
        attractionId: 2,
        beaconUuid: "223e4567-e89b-12d3-a456-426614174001",
        beaconMajor: 2,
        beaconMinor: 200,
      },
    ],
    spot_images: [
      {
        spotId: 1,
        imageUrl: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/12.jpg",
      },
      {
        spotId: 1,
        imageUrl: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/13.jpeg",
      },
      {
        spotId: 2,
        imageUrl: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/22.jpeg",
      },
      {
        spotId: 2,
        imageUrl: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/23.jpeg",
      },
      {
        spotId: 2,
        imageUrl: "https://ballcha-beacon.s3.us-east-1.amazonaws.com/24.jpeg",
      },
    ],
  },
};
