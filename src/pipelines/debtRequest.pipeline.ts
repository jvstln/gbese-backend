export const getDebtStatisticsPipeline = (userId: string) => [
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
      totalDebtAmountPaidByUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: ["$paidDebt.totalDebtAmountPaidByUser", 0],
            },
          },
          "0",
        ],
      },
      totalDebtCountPaidByUser: {
        $ifNull: [
          {
            $toString: {
              $arrayElemAt: ["$paidDebt.totalDebtCountPaidByUser", 0],
            },
          },
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
      totalDebtAmountPaidForUser: {
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
      totalPendingDebtCountCreatedByUser: {
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
];
