import React from "react";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import type { User } from "@/domain/types";

type Props = {
    readonly isOpen: boolean;
    readonly user: User | null;
    readonly onClose: () => void;
    readonly onSave?: (id: number, patch: { name: string; username: string; email: string }) => void;
    readonly onDelete?: (id: number) => void; // 👈 eklendi
};

export function EditUserModal({ isOpen, user, onClose, onSave, onDelete }: Props) {
    const [form, setForm] = React.useState({ name: "", username: "", email: "" });
    const [confirmingDelete, setConfirmingDelete] = React.useState(false); // 👈 eklendi

    React.useEffect(() => {
        if (user) {
            setForm({ name: user.name, username: user.username, email: user.email });
            setConfirmingDelete(false); // modal her açıldığında sıfırla
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
                            {!confirmingDelete ? (
                                <>
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
                                </>
                            ) : (
                                <p className="text-danger font-medium">
                                    Are you sure you want to delete this user?
                                </p>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            {!confirmingDelete ? (
                                <>
                                    <Button variant="flat" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        color="danger"
                                        variant="flat"
                                        onPress={() => setConfirmingDelete(true)} // 👈 onay moduna geç
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            if (!user) return;
                                            const updated = { ...user, ...form };
                                            if (onSave) onSave(user.id, form);
                                            else console.log("Save user (modal):", updated);
                                            onClose();
                                        }}
                                    >
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="flat" onPress={() => setConfirmingDelete(false)}>
                                        No
                                    </Button>
                                    <Button
                                        color="danger"
                                        onPress={() => {
                                            if (!user) return;
                                            if (onDelete) onDelete(user.id);
                                            else console.log("Delete user (modal):", user.id);
                                            onClose();
                                        }}
                                    >
                                        Yes, delete
                                    </Button>
                                </>
                            )}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
