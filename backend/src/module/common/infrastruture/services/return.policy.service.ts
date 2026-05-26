export default function isReturnPolicyExpired(createdAt: Date,): boolean {
    const maxReturnDays = Number(process.env.MAX_RETURN_ORDER_DAYS_POLICY);
    const diffInDays = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays > maxReturnDays;
}