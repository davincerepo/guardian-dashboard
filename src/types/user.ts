
export interface UserVO {
    userId: string
    nickName: string
    avatar: string
    vipLevel: number // 会员等级，0表示不是会员
    vipExpireTime: number // 如果是会员，这个是过期时间
    vipForever: boolean // 是否是永久会员
    vipLastBuyTime: number
    loginToken: string
    bindThirds: Record<string, string>
    hasPassword: boolean
}
