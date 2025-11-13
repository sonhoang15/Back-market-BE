import db from "../models/index.js"

const getAllRoles = async () => {
    try {
        let data = await db.Role.findAll({ order: [['id', 'DESC']] })

        return {
            EM: `Get all role succeeds`,
            EC: 0,
            DT: data
        };
    } catch (error) {
        console.error("Error getting roles:", error);
        return {
            EM: "Error getting roles",
            EC: -1,
            DT: {}
        };
    }
}

const getAllRoleWithPagination = async (page, limit) => {
    try {
        const offset = (page - 1) * limit; // ← THIẾU BIẾN offset
        const { count, rows } = await db.Role.findAndCountAll({
            offset: offset,
            limit: limit,
            order: [['id', 'DESC']]
        })

        const totalPage = Math.ceil(count / limit); // ← THIẾU TÍNH TOÁN totalPage

        let data = {
            totalRows: count,
            totalPage: totalPage,
            roles: rows
        }

        return {
            EM: "ok fetching role",
            EC: 0,
            DT: data
        };
    } catch (error) {
        console.error("Error fetching role:", error);
        return {
            EM: "Error fetching role",
            EC: -1,
            DT: []
        };
    }
}

const createNewRoles = async (roles) => {
    try {
        let currentRoles = await db.Role.findAll({
            attributes: ['url', 'description'],
            raw: true
        })

        const persists = roles.filter(({ url: url1 }) =>
            !currentRoles.some(({ url: url2 }) => url1 === url2)
        )

        if (persists.length === 0) {
            return {
                EM: "Nothing to create ...",
                EC: 0,
                DT: {}
            };
        }

        await db.Role.bulkCreate(persists)
        return {
            EM: `Create role succeeds: ${persists.length} roles`,
            EC: 0,
            DT: {}
        };
    } catch (error) {
        console.error("Error creating roles:", error);
        return {
            EM: "Error create role",
            EC: -1,
            DT: {}
        };
    }
}

const updateRole = async (data) => {
    try {
        if (!data.url) {
            return {
                EM: "Error url empty",
                EC: 1,
                DT: 'url'
            }
        }

        let role = await db.Role.findOne({
            where: { id: data.id }
        });

        if (role) {
            await role.update({
                url: data.url,
                description: data.description,
            })
            return {
                EM: "Update role successfully",
                EC: 0,
                DT: role
            };
        } else {
            return {
                EM: "role not found",
                EC: 2,
                DT: ''
            }
        }
    } catch (error) {
        console.error("Error updating role:", error);
        return {
            EM: "Error updating roles",
            EC: -1,
            DT: {}
        };
    }
}

const deleteRole = async (id) => {
    try {
        let role = await db.Role.findOne({
            where: { id: id }
        })

        if (!role) {
            return {
                EM: "Role not found",
                EC: 1,
                DT: {}
            };
        }

        await role.destroy();
        return {
            EM: `Delete role succeeds`,
            EC: 0,
            DT: {}
        };
    } catch (error) {
        console.error("Error deleting role:", error);
        return {
            EM: "Error Delete role",
            EC: -1,
            DT: {}
        };
    }
}

const getRolesByGroup = async (id) => {
    try {
        if (!id) {
            return {
                EM: `not found any roles`,
                EC: 0,
                DT: []
            };
        }

        let groupWithRoles = await db.Group.findOne({
            where: { id: id },
            attributes: ["id", "name", "description"],
            include: {
                model: db.Role,
                attributes: ["id", "url", "description"],
                through: { attributes: [] }
            },
        })

        return {
            EM: `Get role by group succeeds`,
            EC: 0,
            DT: groupWithRoles
        };
    } catch (error) {
        console.error("Error fetching roles by group:", error);
        return {
            EM: "Error getting roles by group",
            EC: -1,
            DT: []
        };
    }
}

const assignToGroup = async (data) => {
    const t = await db.sequelize.transaction();

    try {
        const { groupId, groupRoles } = data;

        await db.GroupRole.destroy({
            where: { groupId: groupId },
            transaction: t
        })

        const rolesToCreate = groupRoles.map(gr => ({
            groupId: groupId,
            roleId: gr.roleId,
            created_at: new Date(),
            updated_at: new Date()
        }));
        await db.GroupRole.bulkCreate(rolesToCreate, { transaction: t })

        await t.commit();

        return {
            EM: `Assign role to group succeeds`,
            EC: 0,
            DT: []
        };
    } catch (error) {
        await t.rollback();
        return {
            EM: "Error assign role to group",
            EC: -1,
            DT: []
        };
    }
}

export default {
    createNewRoles,
    getAllRoles,
    deleteRole,
    getRolesByGroup,
    assignToGroup,
    getAllRoleWithPagination,
    updateRole
}