export const getDebtStatisticsPipeline = (userId: ObjectId) => [
  {
    $match: {
      $or: [{ debtorId: userId }, { payerId: userId }],
    },
  },

  {
    $facet: {
      paidDebt: [
        { $match: { payerId: userId, status: "accepted" } },
        {
          $group: {
            _id: null,
            totalDebtAmountPaidByUser: { $sum: "$amount" },
            totalDebtCountPaidByUser: { $sum: 1 },
            totalDebtPointEarnedByUser: { $sum: "$debtPoint" },
          },
        },
      ],
      createdAndAcceptedDebt: [
        { $match: { debtorId: userId, status: "accepted" } },
        {
          $group: {
            _id: null,
            totalDebtAmountClearedForUser: { $sum: "$amount" },
          },
        },
      ],
      createdAndPendingDebt: [
        { $match: { debtorId: userId, status: "pending" } },
        {
          $group: {
            _id: null,
            totalPendingDebtAmountCreatedByUser: { $sum: "$amount" },
            totalPendingDebtCountCreatedByUser: { $sum: 1 },
          },
        },
      ],
      createdAndRejectedDebt: [
        { $match: { debtorId: userId, status: "rejected" } },
        {
          $group: {
            _id: null,
            totalRejectedDebtAmountCreatedByUser: { $sum: "$amount" },
          },
        },
      ],
    },
  },
  {
    $project: {
      totalDebtRequestAmountPaidByUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: ["$paidDebt.totalDebtAmountPaidByUser", 0],
            },
          },
          "0",
        ],
      },
      totalDebtRequestCountPaidByUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: ["$paidDebt.totalDebtCountPaidByUser", 0],
            },
          },
          "0",
        ],
      },
      totalDebtRequestPointsEarnedByUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: ["$paidDebt.totalDebtPointsEarnedByUser", 0],
            },
          },
          "0",
        ],
      },
      totalDebtRequestAmountPaidForUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: [
                "$createdAndAcceptedDebt.totalDebtAmountClearedForUser",
                0,
              ],
            },
          },
          "0",
        ],
      },
      totalPendingDebtRequestCountCreatedByUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: [
                "$createdAndPendingDebt.totalPendingDebtCountCreatedByUser",
                0,
              ],
            },
          },
          "0",
        ],
      },
      totalRejectedDebtRequestAmountCreatedByUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: [
                "$createdAndRejectedDebt.totalRejectedDebtAmountCreatedByUser",
                0,
              ],
            },
          },
          "0",
        ],
      },
    },
  },
];
