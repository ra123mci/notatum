<?php

namespace App\Controller;

use App\Entity\Page;
use App\Entity\User;
use App\Repository\PageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * @method User getUser()
 */

#[IsGranted('IS_AUTHENTICATED_FULLY')]
class PageController extends AbstractController
{

    public function __construct(private EntityManagerInterface $em) 
    {}

    #[Route('page/{id?}', name: 'app_page', methods: [REQUEST::METHOD_GET])]
    public function index(?Page $page, ): Response
    {

        if(!$page) {
            $page =  new Page($this->getUser());

            $this->em->persist($page);
            $this->em->flush();

            return $this->redirectToRoute('app_page', [
                'id' => $page->getId()
            ]);
        }

        return $this->render('page/index.html.twig', [
            'currentPage' => $page,
            'pages' => $this->getUser()->getPages(),
        ]);
    }
    
    #[Route('/api/pages', name: 'api_page_add', methods: [REQUEST::METHOD_POST])]
    public function add(): Response
    {
        $page =  new Page($this->getUser());

        $this->em->persist($page);
        $this->em->flush();

        return $this->json([
            'data' => [
                'id' => $page->getId()
            ]
        ]);
    }

    #[Route('/api/pages/{id}', name: 'api_page_update', methods: [REQUEST::METHOD_GET, REQUEST::METHOD_PATCH])]
    public function update(Page $page, Request $request): Response
    {
        if(!$page) {
            return $this->json([], RESPONSE::HTTP_NOT_FOUND);
        } 

        if($request->isMethod(REQUEST::METHOD_PATCH)) {
            $data = json_decode($request->getContent(), true);

            if(isset($data['content'])) {

                $page->setContent(json_encode([
                    'meta'=> [
                        'collaborators' => [],
                        'rating' => 0,
                    ], 'body'=> $data['content']
                ]));
            }

            if(isset($data['title'])) {
                $page->setTitle($data['title']);
            }

            $this->em->flush();
        }

        return $this->json([
            'data' => [
                'id' => $page->getId(),
                'title' => $page->getTitle(),
                'content' => json_decode($page->getContent()),
            ]
        ]);
    }
    
    #[Route('/api/pages/{id}', name: 'api_page_delete', methods: [REQUEST::METHOD_DELETE])]
    public function delete(?Page $page): Response
    {
        if(!$page) {
            return $this->json([], RESPONSE::HTTP_NOT_FOUND);
        } 
        $this->em->remove($page);
        $this->em->flush();

        return $this->json([], RESPONSE::HTTP_ACCEPTED);
    }
}
