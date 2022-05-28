import { sendMessage } from "../../data/chat/general_chat_data"

const chatResolver = {
    Mutation: {
        sendMessage(root:void, args:any){
            return sendMessage(args.message,args.user);
        }
    }
}

export default chatResolver;