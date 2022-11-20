 rewards[0] = RewardInfo(address(0),0,0,0); // Tier 0 reward = loser
        for(uint i=0; i < tiers.length; i++){
            rewards.push(RewardInfo(coins[i], amounts[i], totalClaimable[i], 0));
        }