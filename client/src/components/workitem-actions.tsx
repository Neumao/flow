import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Lock, Unlock, XCircle } from "lucide-react";

export function WorkItemActions({ user, workItem, onEdit, onBlock, onUnblock, onCancel }) {
    const canEdit = (user?.role === "SYSADMIN" || user?.role === "ADMIN" || (user?.role === "USER" && workItem.createdBy?.id === user.id)) && workItem.state !== "CANCELLED" && workItem.state !== "DONE";
    const canBlock = (user?.role === "SYSADMIN" || user?.role === "ADMIN" || user?.role === "MODERATOR") && !workItem.blocked && workItem.state !== "NEW" && workItem.state !== "BLOCKED" && workItem.state !== "CANCELLED" && workItem.state !== "DONE";
    const canUnblock = (user?.role === "SYSADMIN" || user?.role === "ADMIN" || user?.role === "MODERATOR") && workItem.blocked && workItem.state !== "CANCELLED" && workItem.state !== "DONE";
    const canCancel = (user?.role === "SYSADMIN" || user?.role === "ADMIN" || (user?.role === "USER" && workItem.createdBy?.id === user.id)) && workItem.state !== "CANCELLED";

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Edit Action */}
            <div className={`flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow ${canEdit ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20' : ''}`} onClick={canEdit ? onEdit : undefined}>
                {canEdit ? (
                    <>
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                            <Edit className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-xs text-green-600 font-medium">Edit</span>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                            <Edit className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-xs text-red-600 font-medium">Edit</span>
                        <Badge variant="destructive" className="text-xs mt-1">Denied</Badge>
                    </>
                )}
            </div>
            {/* Block Action */}
            <div className={`flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow ${canBlock ? 'cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20' : ''}`} onClick={canBlock ? onBlock : undefined}>
                {canBlock ? (
                    <>
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-2">
                            <Lock className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-xs text-green-600 font-medium">Block</span>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                            <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-xs text-red-600 font-medium">Block</span>
                        <Badge variant="destructive" className="text-xs mt-1">Denied</Badge>
                    </>
                )}
            </div>
            {/* Unblock Action */}
            <div className={`flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow ${canUnblock ? 'cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20' : ''}`} onClick={canUnblock ? onUnblock : undefined}>
                {canUnblock ? (
                    <>
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
                            <Unlock className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-xs text-green-600 font-medium">Unblock</span>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                            <Unlock className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-xs text-red-600 font-medium">Unblock</span>
                        <Badge variant="destructive" className="text-xs mt-1">Denied</Badge>
                    </>
                )}
            </div>
            {/* Cancel Action */}
            <div className={`flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow ${canCancel ? 'cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20' : ''}`} onClick={canCancel ? onCancel : undefined}>
                {canCancel ? (
                    <>
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-xs text-green-600 font-medium">Cancel</span>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                            <XCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-xs text-red-600 font-medium">Cancel</span>
                        <Badge variant="destructive" className="text-xs mt-1">Denied</Badge>
                    </>
                )}
            </div>
        </div>
    );
}
