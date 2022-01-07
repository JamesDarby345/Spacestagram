// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import { ObjectId } from "mongodb";
import { connectDatabase } from "../src/database";
import { NASAImage } from "../src/lib/types";

const seed = async () => {
  try {
    console.log(`seed running...`);

    const db = await connectDatabase();
    const NASAImages: NASAImage[] = [
      {
        _id: new ObjectId(),
        likes: 23,
        copyright:"Luca Vanzella",
        date:"2022-01-05",
        explanation:"Does the Sun always rise in the same direction?  No.  As the months change, the direction toward the rising Sun changes, too.  The featured image shows the direction of sunrise every month during 2021 as seen from the city of Edmonton, Alberta, Canada. The camera in the image is always facing due east, with north toward the left and south toward the right.  As shown in an accompanying video, the top image was taken in 2020 December, while the bottom image was captured in 2021 December, making 13 images in total. Although the Sun always rises in the east in general, it rises furthest to the south of east on the December solstice, and furthest north of east on the June solstice. In many countries, the December Solstice is considered an official change in season: for example the first day of winter in the North.  Solar heating and stored energy in the Earth's surface and atmosphere are near their lowest during winter, making the winter season the coldest of the year.",
        hdurl:"https://apod.nasa.gov/apod/image/2201/SunriseYear_Vanzella_2400.jpg",
        media_type:"image",
        service_version:"v1",
        title:"A Year of Sunrises",
        url:"https://apod.nasa.gov/apod/image/2201/SunriseYear_Vanzella_960.jpg"},
      {
        _id: new ObjectId(),
        likes: 3,
        date:"1995-06-16",
        explanation:"Today's Picture:    Explanation:  If the Earth could somehow be transformed to the ultra-high density of a neutron star , it might appear as it does in the above computer generated figure. Due to the very strong gravitational field, the neutron star distorts light from the background sky greatly. If you look closely, two images of the constellation Orion are visible. The gravity of this particular neutron star is so great that no part of the neutron star is blocked from view - light is pulled around by gravity even from the back of the neutron star.   We keep an  archive file.  Astronomy Picture of the Day is brought to you by  Robert Nemiroff and  Jerry Bonnell . Original material on this page is copyrighted to Robert Nemiroff and Jerry Bonnell.",
        hdurl:"https://apod.nasa.gov/apod/image/e_lens.gif",
        media_type:"image",
        service_version:"v1",
        title:"Neutron Star Earth",
        url:"https://apod.nasa.gov/apod/image/e_lens.gif"
      },
      {
        _id: new ObjectId(),
        likes: 132,
        date:"2001-11-16",
        explanation:"Will the Leonids storm this year? The annual Leonid meteor shower should peak this weekend and some predictions suggest that \"storm\" rates of a thousand or more meteors per hour are possible for observers located in eastern North and Central America during the early morning hours of Sunday, November 18. Similar high rates are also anticipated for the western Pacific region on the morning of November 19th. In any event, the 2001 Leonid shower should be dramatic and easy to watch, as were the Leonids of recent years. From top left to bottom right above are spectacular examples of bright fireball meteors from the 1998 Leonid shower as recorded by V. Winter and J. Dudley, Lorenzo Lovato, and Wally Pacholka. A 1998 image from the Puckett Observatory at lower left features the source of the debris stream which supplies the Leonid meteors, comet Tempel-Tuttle.",
        hdurl:"https://apod.nasa.gov/apod/image/0111/leo98_apodmontage_big.jpg",
        media_type:"image",
        service_version:"v1",
        title:"Leonid Watching",
        url:"https://apod.nasa.gov/apod/image/0111/leo98_apodc2.jpg"
      }
    ];

    for (const NASAImage of NASAImages) {
      await db.NASAImages.insertOne(NASAImage);
    }

    console.log("successfully seeded test database")
  } catch (error) {
    throw new Error("failed to seed database");
  }
};

seed();