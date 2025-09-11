import React from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import type { User } from "@/domain/types";

type Props = {
    readonly isOpen: boolean;
    readonly user: User | null;
    readonly onClose: () => void;
    readonly onSave?: (id: number, patch: { name: string; username: string; email: string }) => void;
};

export function EditUserModal({ isOpen, user, onClose, onSave }: Props) {
    const [form, setForm] = React.useState({ name: "", username: "", email: "" });

    React.useEffect(() => {
        if (user) {
            setForm({ name: user.name, username: user.username, email: user.email });
        }
    }, [user]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} backdrop="blur" placement="center" size="md">
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col">
                            Edit User{user ? ` — #${user.id}` : ""}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="Name"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            />
                            <Input
                                label="Username"
                                value={form.username}
                                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" onPress={onClose}>Cancel</Button>
                            <Button
                                color="primary"
                                onPress={() => {
                                    if (!user) return;
                                    if (onSave) onSave(user.id, form);
                                    else console.log("Save user (modal):", { id: user.id, ...form });
                                    onClose();
                                }}
                            >
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
