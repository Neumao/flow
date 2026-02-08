import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Lock, Unlock, XCircle, Shield } from "lucide-react";

export function WorkItemActions({ user, workItem, onEdit, onBlock, onUnblock, onCancel }) {
    const canEdit = user?.role === "SYSADMIN" || user?.role === "ADMIN" || (user?.role === "USER" && workItem.createdBy?.id === user.id);
    const canBlock = (user?.role === "SYSADMIN" || user?.role === "ADMIN" || (user?.role === "USER" && workItem.createdBy?.id === user.id)) && !workItem.blocked && workItem.state !== "NEW" && workItem.state !== "BLOCKED";
    const canUnblock = (user?.role === "SYSADMIN" || user?.role === "ADMIN" || user?.role === "MODERATOR" || (user?.role === "USER" && workItem.createdBy?.id === user.id)) && workItem.blocked;
    const canCancel = user?.role === "SYSADMIN" || user?.role === "ADMIN" || (user?.role === "USER" && workItem.createdBy?.id === user.id);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    Work Item Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Edit Action */}
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        {canEdit ? (
                            <>
                                <Button size="sm" variant="outline" className="mb-2 gap-1 font-semibold" onClick={onEdit}>
                                    <Edit className="w-4 h-4" />
                                </Button>
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
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        {canBlock ? (
                            <>
                                <Button size="sm" variant="destructive" className="mb-2 gap-1 font-semibold" onClick={onBlock}>
                                    <Lock className="w-4 h-4" />
                                </Button>
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
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        {canUnblock ? (
                            <>
                                <Button size="sm" variant="secondary" className="mb-2 gap-1 font-semibold" onClick={onUnblock}>
                                    <Unlock className="w-4 h-4" />
                                </Button>
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
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        {canCancel ? (
                            <>
                                <Button size="sm" variant="destructive" className="mb-2 gap-1 font-semibold" onClick={onCancel}>
                                    <XCircle className="w-4 h-4" />
                                </Button>
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
            </CardContent>
        </Card>
    );
}
