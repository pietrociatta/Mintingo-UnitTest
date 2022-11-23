 rewards[0] = RewardInfo(address(0),0,0,0); // Tier 0 reward = loser
        for(uint i=0; i < tiers.length; i++){
            rewards.push(RewardInfo(coins[i], amounts[i], totalClaimable[i], 0));
        }

          //  for(uint256 i=0; i < tiers.length; i++){
        //     if (i== 0 ) {
        //         rewards.push(RewardInfo(address(0),0,0,0));
        //     }
        //     rewards.push(RewardInfo(coins[i], amounts[i], totalClaimable[i], 0));
        // }