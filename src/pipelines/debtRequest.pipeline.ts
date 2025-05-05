export const getDebtStatisticsPipeline = (userId: string) => [
  {
    $match: {
      $or: [{ debtorId: userId }, { creditorId: userId }, { payerId: userId }],
    },
  },

  {
    $facet: {
      paidDebt: [
        { $match: { payerId: userId, status: "accepted" } },
        {
          $group: {
            _id: null,
            totalDebtPaidByUser: { $sum: "$amount" },
            totalDebtPointEarnedByUser: { $sum: "$debtPoint" },
          },
        },
      ],
      receivedDebt: [
        { $match: { creditorId: userId, status: "accepted" } },
        {
          $group: {
            _id: null,
            totalDebtFundReceivedByUser: { $sum: "$amount" },
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
      totalDebtPaidByUser: {
        $ifNull: [
          { $toString: { $arrayElemAt: ["$paidDebt.totalDebtPaidByUser", 0] } },
          "0",
        ],
      },
      totalDebtPointsEarnedByUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: ["$paidDebt.totalDebtPointsEarnedByUser", 0],
            },
          },
          "0",
        ],
      },
      totalDebtFundsReceivedByUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: ["$receivedDebt.totalDebtFundsReceivedByUser", 0],
            },
          },
          "0",
        ],
      },
      totalDebtFundsCreatedAndAcceptedByUser: {
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
      totalPendingDebtAmountCreatedByUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: [
                "$createdAndPendingDebt.totalPendingDebtAmountCreatedByUser",
                0,
              ],
            },
          },
          "0",
        ],
      },
      totalRejectedDebtAmountCreatedByUser: {
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
  { $limit: 1 },
];
