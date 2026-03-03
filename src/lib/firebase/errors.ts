export function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "このメールアドレスは既に登録されています"
    case "auth/invalid-email":
      return "メールアドレスの形式が正しくありません"
    case "auth/operation-not-allowed":
      return "この認証方法は無効になっています"
    case "auth/weak-password":
      return "パスワードが弱すぎます"
    case "auth/user-disabled":
      return "このアカウントは無効になっています"
    case "auth/user-not-found":
      return "メールアドレスまたはパスワードが間違っています"
    case "auth/wrong-password":
      return "メールアドレスまたはパスワードが間違っています"
    case "auth/invalid-credential":
      return "メールアドレスまたはパスワードが間違っています"
    case "auth/too-many-requests":
      return "ログイン試行回数が多すぎます。しばらく時間をおいてください"
    default:
      return "エラーが発生しました。もう一度お試しください"
  }
}
