const Info = require("../models/Information");
const Emails = require("../models/Emails");

const overview = async (res) => {
  // number of registration made,
  // number of registration type,
  // number of emails send

  const numberOfRegistration = new Promise(async (resolve, reject) => {
    const count = await Info.countDocuments();
    resolve({ numberOfRegistration: count });
  });

  const numberOfRegistrationType = new Promise(async (resolve, reject) => {
    const selfCount = await Info.aggregate([
      {
        $match: {
          registrationType: "self",
        },
      },
      {
        $count: "self_count",
      },
    ]);

    const groupCount = await Info.aggregate([
      {
        $match: {
          registrationType: "group",
        },
      },
      {
        $count: "group_count",
      },
    ]);

    const corporateCount = await Info.aggregate([
      {
        $match: {
          registrationType: "corporate",
        },
      },
      {
        $count: "corporate_count",
      },
    ]);

    const othersCount = await Info.aggregate([
      {
        $match: {
          registrationType: "others",
        },
      },
      {
        $count: "others_count",
      },
    ]);
    resolve({
      selfCount: selfCount.length !== 0 ? selfCount[0].self_count : 0,
      groupCount: groupCount.length !== 0 ? groupCount[0].group_count : 0,
      corporateCount:
        corporateCount.length !== 0 ? corporateCount[0].corporate_count : 0,
      othersCount: othersCount.length !== 0 ? othersCount[0].others_count : 0,
    });
  });

  const numberOfEmailsSend = new Promise(async (resolve, reject) => {
    const count = await Emails.countDocuments();
    resolve({ numberOfEmailsSend: count });
  });

  Promise.all([
    numberOfEmailsSend,
    numberOfRegistration,
    numberOfRegistrationType,
  ]).then(async (response) => {
    await res.status(201).json({
      numberOfEmailsSend: response[0].numberOfEmailsSend,
      numberOfRegistration: response[1].numberOfRegistration,
      selfCount: response[2].selfCount,
      groupCount: response[2].groupCount,
      corporateCount: response[2].corporateCount,
      othersCount: response[2].othersCount,
    });
  });
};

const details = async (res) => {
  // send data of registration only
  const response = await Info.find().select("-__v -_id -updatedAt");
  return res.status(201).json(response);
};

module.exports = {
  overview,
  details,
};
