<?php

namespace App\Models;

use CodeIgniter\Model;

class MediaModel extends Model
{
    protected $table = 'media_files';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'id',
        'filename',
        'file_path',
        'file_type',
        'file_size',
        'mime_type',
        'alt_text',
        'tags',
        'resolutions',
        'uploaded_at',
        'updated_at'
    ];

    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'uploaded_at';
    protected $updatedField = 'updated_at';

    protected $validationRules = [
        'filename' => 'required|min_length[1]|max_length[255]',
        'file_path' => 'required|min_length[1]|max_length[500]',
        'file_type' => 'required|in_list[image,video]',
        'file_size' => 'required|integer',
        'mime_type' => 'required|min_length[1]|max_length[100]'
    ];

    protected $validationMessages = [];

    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    protected $allowCallbacks = true;
    protected $beforeInsert = ['generateId'];

    protected function generateId(array $data)
    {
        if (empty($data['data']['id'])) {
            $data['data']['id'] = sprintf(
                '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );
        }
        return $data;
    }

    public function getByType($fileType)
    {
        return $this->where('file_type', $fileType)->findAll();
    }

    public function searchByTags($tags)
    {
        $builder = $this->builder();
        $tagsArray = is_array($tags) ? $tags : explode(',', $tags);
        
        foreach ($tagsArray as $tag) {
            $builder->like('tags', trim($tag));
        }
        
        return $builder->get()->getResultArray();
    }

    public function getStorageStats()
    {
        $builder = $this->builder();
        $result = $builder->select('file_type, COUNT(*) as count, SUM(file_size) as total_size')
                         ->groupBy('file_type')
                         ->get()
                         ->getResultArray();
        
        return $result;
    }
}